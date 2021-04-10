# GUI
# done
from flask import redirect, url_for, send_from_directory, render_template, request, jsonify
import os
import web_interface.library.modules.monitor_listeners as monitor_listeners


def main(pyiris, app):
    @app.route('/')
    def redirect_from_root():
        return redirect(url_for('home'))

    @app.route('/favicon.ico')
    def favicon():
        return send_from_directory(os.path.join(app.root_path, 'web_interface/static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

    @app.route('/home', methods=['GET', 'POST'])
    def home():
        pyiris.config.abrupt_end = True
        pyiris.log.page_loaded("Home")
        return render_template('home.html')

    @app.route('/generator', methods=['GET', 'POST'])
    def generator():
        pyiris.config.abrupt_end = True
        pyiris.log.page_loaded("Generator")
        return render_template('generator.html')

    @app.route('/listeners', methods=['GET', 'POST'])
    def listener():
        pyiris.config.abrupt_end = True
        pyiris.log.page_loaded("Listeners")
        return render_template('listeners.html')

    @app.route('/scouts', methods=['GET', 'POST'])
    def scouts():
        pyiris.config.abrupt_end = True
        pyiris.log.page_loaded("Scouts")
        return render_template('scouts.html')

    @app.route('/direct', methods=['GET', 'POST'])
    def direct():
        if pyiris.config.bridged_to is not None:
            pyiris.config.abrupt_end = True
            pyiris.log.page_loaded("Direct")
            return render_template('direct.html')
        else:
            return redirect(url_for("scouts"))

    @app.route('/home_process', methods=['GET', 'POST'])
    def home_process():
        pyiris.log.request(str(request.form['command']), "Home_Process")
        if request.form['command'] is not None:
            pyiris.config.bridged_to = None
            output = exec_with_return("pyiris.home." + request.form['command'], pyiris=pyiris)
            return jsonify(output)
        else:
            pyiris.log.err("None POST made to \x1b[1m\x1b[34mHome Process\x1b[0m")
            return jsonify({"status": "error", "message": "None POST made to Home Process", "data": None})

    @app.route('/generator_process', methods=['GET', 'POST'])
    def generator_process():
        pyiris.log.request(str(request.form['command']), "Generator_Process")
        if request.form['command'] is not None:
            pyiris.config.bridged_to = None
            output = exec_with_return("pyiris.generate." + request.form['command'], pyiris=pyiris)
            return jsonify(output)
        else:
            pyiris.log.err("None POST made to \x1b[1m\x1b[34mGenerator Process\x1b[0m")
            return jsonify({"status": "error", "message": "None POST made to Generator Process", "data": None})

    @app.route('/listeners_process', methods=['GET', 'POST'])
    def listener_process():
        pyiris.log.request(str(request.form['command']), "Listeners_Process")
        if request.form['command'] is not None:
            pyiris.config.bridged_to = None
            output = exec_with_return("pyiris.listener." + request.form['command'], pyiris=pyiris)
            return jsonify(output)
        else:
            pyiris.log.err("None POST made to \x1b[1m\x1b[34mListener Process\x1b[0m")
            return jsonify({"status": "error", "message": "None POST made to Listener Process", "data": None})

    @app.route('/scouts_process', methods=['GET', 'POST'])
    def scouts_process():
        pyiris.log.request(str(request.form['command']), "Scouts_Process")
        if request.form['command'] is not None:
            pyiris.config.bridged_to = None
            output = exec_with_return("pyiris.scout." + request.form['command'], pyiris=pyiris)
            return jsonify(output)
        else:
            pyiris.log.err("None POST made to \x1b[1m\x1b[34mScouts Process\x1b[0m")
            return jsonify({"status": "error", "message": "None POST made to Scouts Process", "data": None})

    @app.route('/direct_process', methods=['GET', 'POST'])
    def direct_process():
        pyiris.log.request(str(request.form['command']), "Direct_Process")
        if pyiris.config.bridged_to is None:
            return jsonify({"status": "ok", "message": "", "data": {"switch_interface": True}})
        if request.form['command'] is not None:
            output = exec_with_return("pyiris.direct." + request.form['command'], pyiris=pyiris)
            output["data"]["switch_interface"] = pyiris.config.bridged_to is None
            return jsonify(output)
        else:
            pyiris.log.err("None POST made to \x1b[1m\x1b[34mScouts Process\x1b[0m")
            return jsonify({"status": "error", "message": "None POST made to Direct Process", "data": None})

    @app.route('/monitor_process', methods=['GET', 'POST'])
    def monitor_process():
        pyiris.log.request(str(request.form['command']), "Monitor_Process")
        if request.form['command'] == "continue":
            output = monitor_listeners.main(pyiris)
        elif request.form['command'] == "start":
            output = monitor_listeners.check(pyiris)
        else:
            output = {"status": "error", "message": "Invalid command to monitor process", "data": None}
        return jsonify(output)


def exec_with_return(code, **kwargs):
    for key, value in kwargs.items():
        exec(key + " = value")
    exec('global exec_return_stuff; exec_return_stuff = %s' % code)
    global exec_return_stuff
    return exec_return_stuff