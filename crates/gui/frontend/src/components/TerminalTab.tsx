import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from '@xterm/addon-fit';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import 'xterm/css/xterm.css';

interface TerminalTabProps {
  sessionId: string;
  cwd: string;
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  isVisible: boolean;
}

export function TerminalTab({ sessionId, cwd, command, args, env, isVisible }: TerminalTabProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const initialized = useRef<boolean>(false);
  const spawnSuccessRef = useRef<boolean>(false);

  useEffect(() => {
    if (!containerRef.current || initialized.current) return;

    let active = true;
    let cleanupFn: (() => void) | null = null;
    let cleanupComposition: (() => void) | null = null;
    let isComposing = false;
    const ptyBuffer: Uint8Array[] = [];

    const flushPtyBuffer = () => {
      if (ptyBuffer.length > 0 && termRef.current) {
        const totalLength = ptyBuffer.reduce((acc, val) => acc + val.length, 0);
        const concatenated = new Uint8Array(totalLength);
        let offset = 0;
        for (const arr of ptyBuffer) {
          concatenated.set(arr, offset);
          offset += arr.length;
        }
        termRef.current.write(concatenated);
        ptyBuffer.length = 0;
      }
    };

    const preventGlobalScroll = (e: Event) => {
      const target = e.target;
      if (target === document || target === window) {
        window.scrollTo(0, 0);
        document.documentElement.scrollLeft = 0;
        document.documentElement.scrollTop = 0;
        document.body.scrollLeft = 0;
        document.body.scrollTop = 0;
        return;
      }

      const el = target as HTMLElement;
      if (el && el.classList) {
        // Allow xterm viewport scrolling to function normally
        if (el.classList.contains('xterm-viewport')) {
          return;
        }

        // Never interfere with xterm's IME helper elements.
        // xterm dynamically writes top/left on xterm-helper-textarea to track
        // cursor position so the OS IME candidate box appears at the right spot.
        // Forcing scrollLeft/scrollTop=0 on the textarea or its parent (.xterm-helpers)
        // races with that JS and causes the candidate box to flicker or jump.
        if (
          el.classList.contains('xterm-helper-textarea') ||
          el.classList.contains('xterm-helpers')
        ) {
          return;
        }
      }
      if (el) {
        el.scrollLeft = 0;
        el.scrollTop = 0;
      }
    };

    document.addEventListener('scroll', preventGlobalScroll, true);

    const startInit = () => {
      if (!active || !containerRef.current) return;

      // Ensure the container is truly mounted in the active document body
      if (!containerRef.current.isConnected) {
        requestAnimationFrame(startInit);
        return;
      }

      initialized.current = true;

      // Create Terminal
      const term = new Terminal({
        cursorBlink: true,
        fontFamily: 'Consolas, "Courier New", monospace',
        fontSize: 13,
        scrollback: 10000,
        theme: {
          background: '#121214',
          foreground: '#e4e4e7',
          cursor: '#a1a1aa',
          black: '#18181b',
          red: '#ef4444',
          green: '#22c55e',
          yellow: '#eab308',
          blue: '#3b82f6',
          magenta: '#a855f7',
          cyan: '#06b6d4',
          white: '#f4f4f5',
          brightBlack: '#71717a',
          brightRed: '#f87171',
          brightGreen: '#4ade80',
          brightYellow: '#facc15',
          brightBlue: '#60a5fa',
          brightMagenta: '#c084fc',
          brightCyan: '#22d3ee',
          brightWhite: '#fafafa',
        }
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(containerRef.current);

      const textarea = term.textarea;
      const termEl = term.element;
      if (textarea && termEl) {
        const handleStart = () => {
          isComposing = true;
          termEl.classList.add('is-composing');
        };
        const handleEnd = () => {
          isComposing = false;
          termEl.classList.remove('is-composing');
          flushPtyBuffer();
        };
        textarea.addEventListener('compositionstart', handleStart);
        textarea.addEventListener('compositionend', handleEnd);
        cleanupComposition = () => {
          textarea.removeEventListener('compositionstart', handleStart);
          textarea.removeEventListener('compositionend', handleEnd);
        };
      }

      // Let the browser handle standard copy and paste shortcuts
      term.attachCustomKeyEventHandler((event) => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'v') {
          return false;
        }
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'c' && term.hasSelection()) {
          return false;
        }
        return true;
      });

      termRef.current = term;
      fitAddonRef.current = fitAddon;

      // Load History Buffer & attach events
      const initShell = async () => {
        // 1. Initial fit check to get size
        const container = containerRef.current;
        if (container && container.clientWidth > 0 && container.clientHeight > 0) {
          try {
            fitAddon.fit();
          } catch (e) {
            console.warn("Initial fit failed, using default size:", e);
          }
        }
        const cols = term.cols && term.cols > 0 ? term.cols : 80;
        const rows = term.rows && term.rows > 0 ? term.rows : 24;

        // 2. Spawn PTY process
        try {
          await invoke('pty_spawn', {
            sessionId,
            cwd,
            command,
            args,
            env,
            cols,
            rows
          });
          if (!termRef.current) return () => {};
          spawnSuccessRef.current = true;
        } catch (err) {
          if (!termRef.current) return () => {};
          term.write(`\r\n\x1b[31mFailed to spawn terminal process: ${err}\x1b[0m\r\n`);
          return () => {};
        }

        // 3. Populate existing history (if any)
        try {
          const history: number[] = await invoke('pty_history', { sessionId });
          if (!termRef.current) return () => {};
          if (history && history.length > 0) {
            term.write(new Uint8Array(history));
          }
        } catch (e) {
          console.warn("Failed to retrieve pty history:", e);
        }

        // 4. Hook up user keyboard input
        const dataSub = term.onData((text) => {
          const encoder = new TextEncoder();
          const bytes = encoder.encode(text);
          invoke('pty_write', { sessionId, data: Array.from(bytes) }).catch(err => {
            console.error("PTY Write error:", err);
          });
        });

        // 5. Listen to stream events directly
        const unlistenData = await listen<number[]>(`pty-data-${sessionId}`, (event) => {
          if (!termRef.current) return;
          const uint8Data = new Uint8Array(event.payload);
          if (isComposing) {
            ptyBuffer.push(uint8Data);
          } else {
            term.write(uint8Data);
          }
        });
        if (!termRef.current) {
          dataSub.dispose();
          unlistenData();
          return () => {};
        }

        const unlistenExit = await listen<void>(`pty-exit-${sessionId}`, () => {
          if (!termRef.current) return;
          term.write('\r\n\x1b[33mTerminal process exited.\x1b[0m\r\n');
        });
        if (!termRef.current) {
          dataSub.dispose();
          unlistenData();
          unlistenExit();
          return () => {};
        }

        // Focus terminal so keyboard input immediately works
        term.focus();

        return () => {
          dataSub.dispose();
          unlistenData();
          unlistenExit();
          if (cleanupComposition) cleanupComposition();
        };
      };

      initShell().then(cleanup => {
        if (active) {
          cleanupFn = cleanup;
        } else if (cleanup) {
          cleanup();
        }
      });
    };

    requestAnimationFrame(startInit);

    // Size observer for resize sync
    const resizeObserver = new ResizeObserver(() => {
      if (isVisible && termRef.current && fitAddonRef.current && spawnSuccessRef.current) {
        const timer = setTimeout(() => {
          if (!termRef.current || !fitAddonRef.current || !spawnSuccessRef.current) return;
          const container = containerRef.current;
          if (container && container.clientWidth > 0 && container.clientHeight > 0) {
            try {
              fitAddonRef.current.fit();
              invoke('pty_resize', {
                sessionId,
                cols: termRef.current.cols,
                rows: termRef.current.rows
              }).catch(err => console.warn("Resize update failed:", err));
            } catch (e) {
              console.warn("Resize error:", e);
            }
          }
        }, 20);
        return () => clearTimeout(timer);
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      active = false;
      resizeObserver.disconnect();
      if (cleanupFn) cleanupFn();
      if (cleanupComposition) cleanupComposition();

      document.removeEventListener('scroll', preventGlobalScroll, true);

      const term = termRef.current;
      termRef.current = null;
      fitAddonRef.current = null;
      spawnSuccessRef.current = false;
      initialized.current = false;

      if (term) {
        setTimeout(() => {
          try {
            term.dispose();
          } catch (e) {
            console.warn("Error disposing terminal:", e);
          }
        }, 0);
      }
      invoke('pty_close', { sessionId }).catch(() => {});
    };
  }, [sessionId, cwd, command, args, env]);

  // Ensure calculations fire when visibility switches back on
  useEffect(() => {
    if (isVisible && fitAddonRef.current && termRef.current && spawnSuccessRef.current) {
      const timer = setTimeout(() => {
        if (!termRef.current || !fitAddonRef.current || !spawnSuccessRef.current) return;
        const container = containerRef.current;
        if (container && container.clientWidth > 0 && container.clientHeight > 0) {
          try {
            fitAddonRef.current.fit();
            invoke('pty_resize', {
              sessionId,
              cols: termRef.current.cols,
              rows: termRef.current.rows
            }).catch(() => {});
            termRef.current.focus();
          } catch (e) {
            console.warn("Visibility resize failed", e);
          }
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isVisible, sessionId]);

  return (
    <div
      ref={outerRef}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#121214',
        padding: '12px',
        borderRadius: 'var(--radius-md, 8px)',
        border: '1px solid var(--border-subtle, #27272a)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <style>{`
        .xterm {
          height: 100%;
        }
        .xterm-viewport {
          height: 100% !important;
        }
        .xterm .xterm-helpers {
          left: 0;
        }
        .xterm.is-composing .xterm-helpers {
          z-index: 10 !important;
        }
        .xterm.is-composing .xterm-helper-textarea {
          font-family: Consolas, "Courier New", monospace !important;
          font-size: 13px !important;
          line-height: 1.2 !important;
          border: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
          outline: none !important;
          box-shadow: none !important;
          color: transparent !important;
          background: transparent !important;
          caret-color: transparent !important;
          opacity: 1 !important;
          z-index: 10 !important;
        }
      `}</style>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          position: 'relative'
        }}
      />
    </div>
  );
}
