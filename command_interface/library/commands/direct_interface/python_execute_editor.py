import time


def main(pyiris):
    pyiris.log.inf('You are currently in the python executor scripter, script a chain of python instructions to run, enter for a newline, CTRL-C to finish ' \
                 '\n(only works if python execute component is loaded)')
    try:
        command = ''
        while True:
            line = '\n' + input('Python Executor Scripter >>> ')
            command += line
    except EOFError:
        try:
            time.sleep(2)
        except KeyboardInterrupt:
            pyiris.log.blank("\n")
            pyiris.log.pos('Done')
            return command
    except KeyboardInterrupt:
        pyiris.log.blank("\n")
        pyiris.log.pos('Done')
        return command