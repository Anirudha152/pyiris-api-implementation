import command_interface.library.modules.prompt_arguement_gen as prompt_arguement_gen
import command_interface.library.interfaces.generator_interface as generator_interface
import command_interface.library.interfaces.listener_interface as listener_interface
import command_interface.library.interfaces.scout_interface as scout_interface

try:
    import readline
except ImportError:
    import gnureadline as readline

home_commands = ['clear', 'help', 'local', 'python', 'quit', 'add', 'regen', 'reset', 'rm', 'show', 'generator',
                 'listeners', 'scouts']


def home_completer(text, state):
    for cmd in home_commands:
        if cmd.startswith(text):
            if not state:
                return cmd
            else:
                state -= 1


def main(pyiris):
    readline.parse_and_bind("tab: complete")
    readline.set_completer(home_completer)
    while True:
        try:
            prompt = input('\x1b[1m\x1b[37mPyIris (Home) > \x1b[0m').strip()
            command = prompt.split(' ', 1)[0].lower()
            if command == 'add':
                pyiris.home.add_to_list(*prompt_arguement_gen.main(prompt=prompt, count=2))
            elif command == 'clear':
                pyiris.global_functions.clear()
            elif command == 'generator':
                pyiris.log.inf('Switching...')
                generator_interface.main(pyiris)
                readline.parse_and_bind("tab: complete")
                readline.set_completer(home_completer)
            elif command in ('?', 'help'):
                pyiris.global_functions.help('home', prompt)
            elif command == 'listeners':
                pyiris.log.inf('Switching...')
                listener_interface.main(pyiris)
                readline.parse_and_bind("tab: complete")
                readline.set_completer(home_completer)
            elif command in ('!', 'local'):
                pyiris.global_functions.local(*prompt_arguement_gen.main(prompt=prompt, count=1))
            elif command == "python":
                pyiris.global_functions.python()
            elif command == "quit":
                pyiris.global_functions.quit()
            elif command == "regen":
                continue_on = input(pyiris.config.war + 'This will overwrite existing key, continue? [y|n] : ')
                if continue_on == 'y':
                    pyiris.home.regen_key(*prompt_arguement_gen.main(prompt=prompt, count=1, replace_empty_with=None))
            elif command == "reset":
                pyiris.home.reset_list(*prompt_arguement_gen.main(prompt=prompt, count=1))
            elif command == "rm":
                pyiris.home.remove_list(*prompt_arguement_gen.main(prompt=prompt, count=2))
            elif command == 'scouts':
                pyiris.log.inf('Switching...')
                scout_interface.main(pyiris)
                readline.parse_and_bind("tab: complete")
                readline.set_completer(home_completer)
            elif command == 'show':
                pyiris.home.show(*prompt_arguement_gen.main(prompt=prompt, count=1))
            elif not command:
                pass
            else:
                pyiris.log.err('Invalid command, run "help" for help menu')
        except KeyboardInterrupt:
            pyiris.global_functions.quit()


