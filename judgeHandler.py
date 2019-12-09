from database import db, Submission
import time
import subprocess


def main():
    while True:
        submissions = db.session.query(
            Submission).filter(Submission.status == "WJ")
        for submission in submissions:
            result, score, _ = subprocess.check_output(
                ["./judge"], input=submission.move, text=True).split("\n")
            submission.status = result
            if (result == "AC"):
                submission.score = int(score)
            db.session.add(submission)
            db.session.commit()
        time.sleep(1)


if __name__ == "__main__":
    main()
