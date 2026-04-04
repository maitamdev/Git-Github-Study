import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

interface TerminalProps {
  onCommand: (command: string) => Promise<string>;
}

const COLORS = {
  blue: '\x1b[1;34m',
  green: '\x1b[1;32m',
  yellow: '\x1b[1;33m',
  red: '\x1b[1;31m',
  cyan: '\x1b[1;36m',
  reset: '\x1b[0m'
};

export default function Terminal({ onCommand }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const commandRef = useRef<string>('');
  const historyRef = useRef<string[]>([]);
  const historyIdxRef = useRef<number>(-1);

  useEffect(() => {
    if (!terminalRef.current) return;

    const xterm = new XTerm({
      cursorBlink: true,
      theme: {
        background: '#0f172a', // Slate 900
        foreground: '#f8fafc', // Slate 50
        cursor: '#3b82f6',     // Blue 500
        selectionBackground: 'rgba(59, 130, 246, 0.3)',
      },
      fontFamily: 'JetBrains Mono, Menlo, Monaco, "Courier New", monospace',
      fontSize: 14,
      lineHeight: 1.4,
    });

    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);
    xterm.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = xterm;

    const prompt = () => {
      xterm.write(`\r\n${COLORS.green}user@git-learner${COLORS.reset}:${COLORS.blue}~/project${COLORS.reset}$ `);
      commandRef.current = '';
    };

    xterm.writeln(`${COLORS.cyan}=== Git Interactive Terminal ===${COLORS.reset}`);
    xterm.writeln('Gõ ' + COLORS.yellow + 'help' + COLORS.reset + ' để xem danh sách các lệnh hỗ trợ.');
    xterm.writeln('----------------------------------------');
    
    // Initial prompt without newline
    xterm.write(`${COLORS.green}user@git-learner${COLORS.reset}:${COLORS.blue}~/project${COLORS.reset}$ `);

    xterm.onData(async (e) => {
      switch (e) {
        case '\r': // Enter
          xterm.write('\r\n');
          const cmd = commandRef.current.trim();
          if (cmd) {
            historyRef.current.push(cmd);
            historyIdxRef.current = historyRef.current.length;
            
            const output = await onCommand(cmd);
            if (output === '__CLEAR__') {
              xterm.clear();
            } else if (output) {
              // Simple syntax highlighting heuristic
              let formattedOutput = output.replace(/\n/g, '\r\n');
              if (formattedOutput.includes('Lỗi') || formattedOutput.includes('fatal:') || formattedOutput.includes('error:')) {
                formattedOutput = `${COLORS.red}${formattedOutput}${COLORS.reset}`;
              } else if (formattedOutput.includes('Đã thêm') || formattedOutput.includes('Thành công')) {
                formattedOutput = `${COLORS.green}${formattedOutput}${COLORS.reset}`;
              }
              xterm.writeln(formattedOutput);
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
        case '\x1b[A': // Up arrow
          if (historyRef.current.length > 0 && historyIdxRef.current > 0) {
            // Clear current line
            while (commandRef.current.length > 0) {
              xterm.write('\b \b');
              commandRef.current = commandRef.current.slice(0, -1);
            }
            historyIdxRef.current--;
            commandRef.current = historyRef.current[historyIdxRef.current];
            xterm.write(commandRef.current);
          }
          break;
        case '\x1b[B': // Down arrow
          if (historyRef.current.length > 0 && historyIdxRef.current < historyRef.current.length) {
            while (commandRef.current.length > 0) {
              xterm.write('\b \b');
              commandRef.current = commandRef.current.slice(0, -1);
            }
            historyIdxRef.current++;
            if (historyIdxRef.current === historyRef.current.length) {
              commandRef.current = '';
            } else {
              commandRef.current = historyRef.current[historyIdxRef.current];
            }
            xterm.write(commandRef.current);
          }
          break;
        default: // Print all other characters
          // Handle copy paste (multiple characters at once)
          if (e.length > 1) {
            // Strip any carriage returns or newlines to paste as a single line
            const printablePasted = e.replace(/[\r\n]/g, '').split('').filter(c => c >= String.fromCharCode(0x20) && c <= String.fromCharCode(0x7E) || c >= '\u00a0').join('');
            commandRef.current += printablePasted;
            xterm.write(printablePasted);
            break;
          }
          // Ignore other escape sequences
          if (e.length === 1 && (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7E) || e >= '\u00a0')) {
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

  return <div ref={terminalRef} className="absolute inset-0 p-2 bg-[#0f172a] rounded-bl-lg" />;
}
