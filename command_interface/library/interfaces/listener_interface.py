import command_interface.library.modules.prompt_arguement_gen as prompt_arguement_gen

try:
    import readline
except ImportError:
    import gnureadline as readline

listener_commands = ['clear', 'help', 'local', 'python', 'quit', 'bind', 'kill', 'more', 'rename', 'reset', 'run',
                     'set', 'show', 'back']


def listener_completer(text, state):
    for cmd in listener_commands:
        if cmd.startswith(text):
            if not state:
                return cmd
            else:
                state -= 1


def main(pyiris):
    readline.parse_and_bind("tab: complete")
    readline.set_completer(listener_completer)
    while True:
        try:
            prompt = input('\x1b[1m\x1b[37mPyIris (\x1b[0m' + '\x1b[1m\x1b[34mListeners\x1b[0m' + '\x1b[1m\x1b[37m) > \x1b[0m').strip()
            command = prompt.split(' ', 1)[0].lower()
            if command == "back":
                pyiris.log.inf('Returning...')
                return
            elif command == 'bind':
                pyiris.listener_interface.bind(*prompt_arguement_gen.main(prompt=prompt, count=2))
            elif command == 'clear':
                pyiris.global_functions.clear()
            elif command in ('?', 'help'):
                pyiris.global_functions.help('listener', prompt)
            elif command == "kill":
                pyiris.listener.kill_listener(*prompt_arguement_gen.main(prompt=prompt, count=1))
            elif command in ('!', 'local'):
                pyiris.global_functions.local(*prompt_arguement_gen.main(prompt=prompt, count=1))
            elif command == 'more':
                pyiris.listener.listener_info(*prompt_arguement_gen.main(prompt=prompt, count=1))
            elif command == "python":
                pyiris.global_functions.python()
            elif command == "quit":
                pyiris.global_functions.quit()
            elif command == "rename":
                pyiris.listener.rename_listener(*prompt_arguement_gen.main(prompt=prompt, count=2))
            elif command == 'reset':
                pyiris.listener.reset_listener_values(*prompt_arguement_gen.main(prompt=prompt, count=1))
            elif command == 'run':
                pyiris.listener.run_listener()
            elif command == "show":
                pyiris.listener.show(*prompt_arguement_gen.main(prompt=prompt, count=1))
            elif command == "set":
                pyiris.listener.set_listener_values(*prompt_arguement_gen.main(prompt=prompt, count=2))
            elif not command:
                pass
            else:
                pyiris.log.err('Invalid command, run "help" for help menu')
        except KeyboardInterrupt:
            pyiris.global_functions.quit()