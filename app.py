from flask import Flask, render_template, request, escape, redirect, abort, flash, url_for
from flask_login import LoginManager, current_user, login_user, logout_user
from database import Submission, User, db, app
from sqlalchemy import func
import datetime


@app.route('/')
def index():
    return redirect(url_for('ranking'))


@app.route('/submissions/<id>')
def submissions(id):
    if current_user.is_authenticated == False:
        return render_template("login.html")
    if (id == "me"):
        allsubmissions = db.session.query(Submission).filter(
            Submission.username == current_user.username).order_by(Submission.id.asc()).all()
        return render_template("mysubmissions.html", submissions=allsubmissions)
    else:
        try:
            id = int(id)
        except:
            flash("URLが無効です", category='alert alert-danger')
            return render_template("mysubmissions.html", submissions=[])
        submission = db.session.query(Submission).get(id)
        if submission.username != current_user.username:
            flash("現在、他のユーザの提出を見ることはできません", category='alert alert-danger')
            return redirect("/submissions/me")
        return render_template("submission.html", submission=submission)


@app.route('/ranking')
def ranking():
    submissions = db.session.query(Submission, func.max(Submission.score)).group_by(
        Submission.username).order_by(Submission.score.desc(), Submission.id.asc()).all()
    return render_template("ranking.html", submissions=[row for row, _ in submissions])


@app.route('/about')
def about():
    return render_template("about.html")


@app.route('/task')
def task():
    return render_template("task.html")


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
            return redirect('/register')
        user = User.query.filter_by(username=username).scalar()

        if user is not None:
            print(user)
            flash("そのユーザー名はすでに使われています",
                  category='alert alert-danger')
            return redirect(url_for('register'))
        user = User(username, password)
        db.session.add(user)
        db.session.commit()
        login_user(user)
        flash("登録しました！", category='alert alert-success')
        return redirect("/about")


@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "GET":
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
        return redirect("/about")


@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('about'))


@app.route('/submit', methods=['GET', 'POST'])
def submit():
    if current_user.is_authenticated == False:
        return render_template("submit.html")
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('ファイルが選択されていません', category='alert alert-danger')
            return redirect("/submit")
        answer = ""
        try:
            answer = request.files["file"].read().decode("UTF-8")
        except:
            flash('不正なファイルです。ファイルのエンコードはUTF-8である必要があります',
                  category='alert alert-danger')
            return redirect("/submit")
        sub = Submission()
        sub.username = current_user.username
        sub.move = answer
        sub.submitdate = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        db.session.add(sub)
        db.session.commit()
        flash("提出しました", category='alert alert-success')
        return redirect("/submissions/me")
    else:
        return render_template("submit.html")


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
