# Version 2.0.0
from pyiris_api import PyIris
import argparse
import time
import command_interface.library.commands.global_interface.clear as clear

parser = argparse.ArgumentParser(description='GUI / CUI')
parser.add_argument('-g', action="store_true", required=False)
parser.add_argument('-c', action="store_true", required=False)
parser.add_argument('-v', action="store_true", required=False)
args = parser.parse_args()


if __name__ == '__main__':
    try:
        clear.main()
        if args.g:
            interface = "GUI"
        elif args.c:
            interface = "CUI"
        else:
            while True:
                interface = input('\x1b[1m\x1b[37m[\x1b[0m\033[92m' +
                                  '\x1b[1m\x1b[31mlibrary/modules/bootstrap\x1b[0m' +
                                  '\x1b[1m\x1b[37m > ]\x1b[0m ' + 'Graphical Interface / Command Interface [G/C]\x1b[0m : ')
                if interface == "g" or interface == "G":
                    interface = "GUI"
                    break
                elif interface == "c" or interface == "C":
                    interface = "CUI"
                    break
        print("\x1b[1m\x1b[34m[*]\x1b[0mInterface set to " + interface)
        if interface == "GUI":
            import web_interface.library.modules.log_handler as log_handler
            import web_interface.library.modules.url_binder as url_binder
            import logging
            import os
            import flask
            pyiris = PyIris.Main(verbose=True, log_handler=log_handler.Main, level=[logging.INFO if args.v else logging.WARNING][0])
            app = flask.Flask(__name__, static_folder="web_interface/static", template_folder="web_interface/templates")
            app.secret_key = os.urandom(24)
            url_binder.main(pyiris, app)
            if __name__ == "__main__":
                clear.main()
                pyiris.log.inf("PyIris Web Interface started on localhost:5000")
                app.run()
        elif interface == "CUI":
            import command_interface.library.interfaces.home_interface as home_interface
            pyiris = PyIris.Main(verbose=True)
            clear.main()
            home_interface.main(pyiris)
    except EOFError:
        try:
            time.sleep(2)
        except KeyboardInterrupt:
            print('[!]User aborted bootstrap, requesting shutdown...')
            quit()
    except KeyboardInterrupt:
        print('[!]User aborted bootstrap, requesting shutdown...')
        quit()
    except Exception as e:
        raise e
