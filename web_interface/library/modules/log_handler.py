# GUI
# done
import logging
import inspect
from colorlog import ColoredFormatter
import os


class Main:
    def __init__(self, pyiris_self):
        self.config = pyiris_self.config
        logging.getLogger('werkzeug').disabled = True
        os.environ['WERKZEUG_RUN_MAIN'] = 'true'
        format = "%(log_color)s%(levelname)s%(reset)s >> %(message)s"
        logging.root.setLevel(self.config.level)
        formatter = ColoredFormatter(format)
        stream = logging.StreamHandler()
        stream.setLevel(self.config.level)
        stream.setFormatter(formatter)
        self.log = logging.getLogger('pythonConfig')
        self.log.setLevel(self.config.level)
        self.log.addHandler(stream)

    def inf(self, message):
        if self.config.verbose and self.config.level == logging.INFO or self.config.level == logging.DEBUG:
            caller = inspect.getframeinfo(inspect.stack()[1][0])
            filename = caller.filename.split("\\")[-1]
            function = inspect.currentframe().f_back.f_code.co_name + "()"
            line = str(caller.lineno)
            self.log.info(f"[\x1b[1m\x1b[35m{filename}\x1b[0m/\x1b[1m\x1b[35m{function}\x1b[0m:\x1b[1m\x1b[35m{line}\x1b[0m] - {message}")

    def pos(self, message):
        if self.config.verbose and self.config.level == logging.INFO or self.config.level == logging.DEBUG:
            caller = inspect.getframeinfo(inspect.stack()[1][0])
            filename = caller.filename.split("\\")[-1]
            function = inspect.currentframe().f_back.f_code.co_name + "()"
            line = str(caller.lineno)
            self.log.info(f"[\x1b[1m\x1b[35m{filename}\x1b[0m/\x1b[1m\x1b[35m{function}\x1b[0m:\x1b[1m\x1b[35m{line}\x1b[0m] - {message}")

    def war(self, message):
        if self.config.verbose and self.config.level == logging.INFO or self.config.level == logging.DEBUG or self.config.level == logging.WARNING:
            caller = inspect.getframeinfo(inspect.stack()[1][0])
            filename = caller.filename.split("\\")[-1]
            function = inspect.currentframe().f_back.f_code.co_name + "()"
            line = str(caller.lineno)
            self.log.warning(f"[\x1b[1m\x1b[35m{filename}\x1b[0m/\x1b[1m\x1b[35m{function}\x1b[0m:\x1b[1m\x1b[35m{line}\x1b[0m] - {message}")

    def err(self, message):
        if self.config.verbose and self.config.level == logging.INFO or self.config.level == logging.DEBUG or self.config.level == logging.WARNING or self.config.level == logging.ERROR:
            caller = inspect.getframeinfo(inspect.stack()[1][0])
            filename = caller.filename.split("\\")[-1]
            function = inspect.currentframe().f_back.f_code.co_name + "()"
            line = str(caller.lineno)
            self.log.error(f"[\x1b[1m\x1b[35m{filename}\x1b[0m/\x1b[1m\x1b[35m{function}\x1b[0m:\x1b[1m\x1b[35m{line}\x1b[0m] - {message}")

    def blank(self, message):
        if self.config.verbose and self.config.level == logging.INFO or self.config.level == logging.DEBUG:
            caller = inspect.getframeinfo(inspect.stack()[1][0])
            filename = caller.filename.split("\\")[-1]
            function = inspect.currentframe().f_back.f_code.co_name + "()"
            line = str(caller.lineno)
            self.log.info(f"[\x1b[1m\x1b[35m{filename}\x1b[0m/\x1b[1m\x1b[35m{function}\x1b[0m:\x1b[1m\x1b[35m{line}\x1b[0m] - {message}")

    def lod(self, message):
        if self.config.verbose and self.config.level == logging.INFO or self.config.level == logging.DEBUG:
            caller = inspect.getframeinfo(inspect.stack()[1][0])
            filename = caller.filename.split("\\")[-1]
            function = inspect.currentframe().f_back.f_code.co_name + "()"
            line = str(caller.lineno)
            self.log.info(f"[\x1b[1m\x1b[35m{filename}\x1b[0m/\x1b[1m\x1b[35m{function}\x1b[0m:\x1b[1m\x1b[35m{line}\x1b[0m] - {message}")

    def page_loaded(self, page):
        if self.config.verbose and self.config.level == logging.INFO or self.config.level == logging.DEBUG:
            self.plaintext("--------------------------------------")
            self.log.info(f"[\033[92m{page}\033[0m] - Loading Page...")

    def request(self, request, process):
        if self.config.verbose and self.config.level == logging.INFO or self.config.level == logging.DEBUG:
            self.log.info(f"[\033[94m{process}\033[0m] - {request}")

    def plaintext(self, message):
        if self.config.verbose and self.config.level == logging.INFO or self.config.level == logging.DEBUG:
            self.log.info(message)
