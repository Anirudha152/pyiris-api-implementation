import command_interface.library.modules.prompt_arguement_gen as prompt_arguement_gen
import command_interface.library.commands.generator_interface.generate as generate

try:
    import readline
except ImportError:
    import gnureadline as readline

generator_commands = ['clear', 'help', 'local', 'python', 'quit', 'generate', 'load_com', 'unload_com', 'load_enc',
                      'unload_enc', 'more_com', 'more_enc', 'reset', 'set', 'show', 'back']


def generator_completer(text, state):
    for cmd in generator_commands:
        if cmd.startswith(text):
            if not state:
                return cmd
            else:
                state -= 1


def main(pyiris):
    readline.parse_and_bind("tab: complete")
    readline.set_completer(generator_completer)
    while True:
        try:
            prompt = input(pyiris.config.generator_prompt).strip()
            command = prompt.split(' ', 1)[0].lower()
            if command == "back":
                pyiris.log.inf('Returning...')
                return
            elif command == 'clear':
                pyiris.global_functions.clear()
            elif command == "generate":
                generate.main(pyiris)
            elif command in ('?', 'help'):
                pyiris.global_functions.help('generator', prompt)
            elif command == "load_base":
                pyiris.generate.load_base(*prompt_arguement_gen.main(prompt=prompt, count=1))
            elif command == "load_com":
                pyiris.generate.load_component(*prompt_arguement_gen.main(prompt=prompt, count=1))
            elif command == "load_enc":
                pyiris.generate.load_encoder(*prompt_arguement_gen.main(prompt=prompt, count=1))
            elif command in ('!', 'local'):
                pyiris.global_functions.local(*prompt_arguement_gen.main(prompt=prompt, count=1))
            elif command == "more_base":
                pyiris.generate.base_info(*prompt_arguement_gen.main(prompt=prompt, count=1))
            elif command == "more_com":
                pyiris.generate.component_info(*prompt_arguement_gen.main(prompt=prompt, count=1))
            elif command == "more_enc":
                pyiris.generate.encoder_info(*prompt_arguement_gen.main(prompt=prompt, count=1))
            elif command == "python":
                pyiris.global_functions.python()
            elif command == "quit":
                pyiris.global_functions.quit()
            elif command == "reset":
                pyiris.generate.reset_scout_values(*prompt_arguement_gen.main(prompt=prompt, count=1))
            elif command == "set":
                pyiris.generate.set_scout_values(*prompt_arguement_gen.main(prompt=prompt, count=2))
            elif command == "show":
                pyiris.generate.show(*prompt_arguement_gen.main(prompt=prompt, count=1))
            elif command == "unload_com":
                pyiris.generate.unload_component(*prompt_arguement_gen.main(prompt=prompt, count=1))
            elif command == "unload_enc":
                pyiris.generate.unload_encoder(*prompt_arguement_gen.main(prompt=prompt, count=1))
            elif not command:
                pass
            else:
                pyiris.log.err('Invalid command, run "help" for help menu')
        except KeyboardInterrupt:
            pyiris.global_functions.quit()
