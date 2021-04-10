import command_interface.library.modules.prompt_arguement_gen as prompt_arguement_gen
import command_interface.library.interfaces.direct_interface as direct_interface

try:
    import readline
except ImportError:
    import gnureadline as readline

scout_commands = ['clear', 'help', 'local', 'python', 'quit', 'bridge', 'disconnect', 'kill', 'more', 'ping', 'rename',
                  'show', 'sleep', 'back']


def scout_completer(text, state):
    for cmd in scout_commands:
        if cmd.startswith(text):
            if not state:
                return cmd
            else:
                state -= 1


def main(pyiris):
    readline.parse_and_bind("tab: complete")
    readline.set_completer(scout_completer)
    while True:
        try:
            prompt = input('\x1b[1m\x1b[37mPyIris (\x1b[0m' + '\x1b[1m\x1b[31mScouts\x1b[0m' + '\x1b[1m\x1b[37m) > \x1b[0m').strip()
            command = prompt.split(' ', 1)[0].lower()
            if command == "back":
                pyiris.log.inf('Returning...')
                return
            elif command == "bridge":
                pyiris.scout.bridge_scout(*prompt_arguement_gen.main(prompt=prompt, count=1))
                output = direct_interface.main(pyiris)
                if output == "home":
                    pyiris.log.inf('Returning...')
                    return
                readline.parse_and_bind("tab: complete")
                readline.set_completer(scout_completer)
            elif command == 'clear':
                pyiris.global_functions.clear()
            elif command == 'disconnect':
                pyiris.scout.disconnect_scout(*prompt_arguement_gen.main(prompt=prompt, count=1))
            elif command in ('?', 'help'):
                pyiris.global_functions.help('scout', prompt)
            elif command == 'kill':
                pyiris.scout.kill_scout(*prompt_arguement_gen.main(prompt=prompt, count=1))
            elif command in ('!', 'local'):
                pyiris.global_functions.local(*prompt_arguement_gen.main(prompt=prompt, count=1))
            elif command == 'rename':
                pyiris.scout.rename_scout(*prompt_arguement_gen.main(prompt=prompt, count=2))
            elif command == 'sleep':
                pyiris.scout.sleep_scout(*prompt_arguement_gen.main(prompt=prompt, count=2))
            elif command == 'ping':
                pyiris.scout.ping_scout(*prompt_arguement_gen.main(prompt=prompt, count=1))
            elif command == "python":
                pyiris.global_functions.python()
            elif command == "quit":
                pyiris.global_functions.quit()
            elif command == 'show':
                pyiris.scout.show(*prompt_arguement_gen.main(prompt=prompt, count=1))
            elif command == 'more':
                pyiris.scout.more_scout(*prompt_arguement_gen.main(prompt=prompt, count=1))
            elif not command:
                pass
            else:
                pyiris.log.err('Invalid command, run "help" for help menu')
        except KeyboardInterrupt:
            pyiris.global_functions.quit()