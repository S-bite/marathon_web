from flask import Flask, render_template, request, escape, redirect, abort, flash, url_for
from flask_login import LoginManager, current_user, login_user
from database import Submission, User, db, app


@app.route('/')
def index():
    allsubmissions = Submission.query.all()
    return render_template("ranking.html", submissions=allsubmissions)


@app.route('/ranking')
def ranking():
    allsubmissions = Submission.query.all()
    return render_template("ranking.html", submissions=allsubmissions)


@app.route('/about')
def about():
    return render_template("about.html")


@app.route('/task')
def task():
    return render_template("about.html")


@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "GET":
        print(current_user.username)
        return render_template("login.html",)
    else:
        username = escape(request.form["username"])
        password = request.form["password"]
        user = User.query.filter_by(username=username).first()
        if user is None or not user.check_password(password):
            flash("ユーザー名かパスワードが間違っています",
                  category='alert alert-danger')
            return redirect(url_for('login'))
        login_user(user)
        flash("ログインしました！", category='alert alert-success')
        return redirect(url_for('login'))


@app.route('/register', methods=["GET", "POST"])
def register():
    if request.method == "GET":
        return render_template("register.html")
    else:
        username = escape(request.form["username"])
        password = request.form["password"]
        if (len(username) >= 80):
            flash("ユーザー名が長すぎます。80文字までにしてください",
                  category='alert alert-danger')
            return redirect(url_for('register'))
        user = User.query.filter_by(username=username).scalar()

        if user is not None:
            print(user)
            flash("そのユーザー名はすでに使われています",
                  category='alert alert-danger')
            return redirect(url_for('register'))
        user = User(username, password)
        db.session.add(user)
        db.session.commit()
        flash("登録しました！", category='alert alert-success')
        return redirect(url_for('register'))


@app.route('/submit')
def submit():
    return render_template("submit.html")


@app.route('/delete')
def delete():
    db.drop_all()
    db.create_all()
    return "ok"


if __name__ == '__main__':
    app.secret_key = "super duper secret string!!!"
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = "users.login"  # login_viewのrouteを設定
    @login_manager.user_loader
    def load_user(username):
        return User.query.filter_by(username=username).first()

    db.create_all()
    app.run(debug=True)
