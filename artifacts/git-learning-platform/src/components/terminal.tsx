import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

interface TerminalProps {
  onCommand: (command: string) => Promise<string>;
}

export default function Terminal({ onCommand }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const commandRef = useRef<string>('');

  useEffect(() => {
    if (!terminalRef.current) return;

    const xterm = new XTerm({
      cursorBlink: true,
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
      },
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      fontSize: 14,
    });

    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);
    xterm.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = xterm;

    const prompt = () => {
      xterm.write('\r\n$ ');
      commandRef.current = '';
    };

    xterm.writeln('Welcome to Git Terminal');
    xterm.write('$ ');

    xterm.onData(async (e) => {
      switch (e) {
        case '\r': // Enter
          xterm.write('\r\n');
          const cmd = commandRef.current.trim();
          if (cmd) {
            const output = await onCommand(cmd);
            if (output) {
              xterm.writeln(output.replace(/\n/g, '\r\n'));
            }
          }
          prompt();
          break;
        case '\u007F': // Backspace (DEL)
          if (commandRef.current.length > 0) {
            xterm.write('\b \b');
            commandRef.current = commandRef.current.slice(0, -1);
          }
          break;
        default: // Print all other characters
          if (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7E) || e >= '\u00a0') {
            commandRef.current += e;
            xterm.write(e);
          }
      }
    });

    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      xterm.dispose();
    };
  }, [onCommand]);

  return <div ref={terminalRef} className="absolute inset-0 p-2 bg-[#1e1e1e]" />;
}
