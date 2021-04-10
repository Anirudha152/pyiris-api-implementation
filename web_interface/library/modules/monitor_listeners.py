# GUI
# done
import time


def check(pyiris):
    listener_database = pyiris.config.listener_database.copy()
    scout_database = pyiris.config.scout_database.copy()
    scout_database = {key: {inner_key: inner_value for inner_key, inner_value in value.items() if inner_key != "conn_object"} for key, value in scout_database.items()}
    return {"status": "ok", "message": "", "data": {"scout_database": scout_database, "listener_database": listener_database, "message": None}}


def main(pyiris):
    pyiris.log.inf("Started Monitor")
    while True:
        pyiris.config.monitoring = True
        if not pyiris.config.abrupt_end:
            try:
                try:
                    message = pyiris.config.thread_message
                    pyiris.config.thread_message = []
                    if message[0]:
                        output = {"status": "ok", "message": "", "data": {"scout_database": {}, "listener_database": {}, "message": message}}
                        pyiris.log.inf("Received message from listener thread. Exiting Monitor")
                        pyiris.config.monitoring = False
                        return output
                except:
                    pass
                if pyiris.config.change:
                    pyiris.log.inf("Change Detected")
                    pyiris.config.change = False
                    output = check(pyiris)
                    pyiris.log.inf("Exiting Monitor")
                    pyiris.config.monitoring = False
                    return output
            except Exception as e:
                pyiris.log.err(str(e))
                return {"status": "error", "message": str(e), "data": None}
        else:
            pyiris.log.inf("Forced Thread Shutdown, Exiting monitor")
            pyiris.config.abrupt_end = False
            pyiris.config.monitoring = False
            return {"status": "Success", "message": "Forced Shutdown", "data": None}
        time.sleep(0.1)