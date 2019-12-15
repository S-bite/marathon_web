from database import db, Submission
from genMove import genMove
db.create_all()

for i in range(1000):
    sub = Submission()
    sub.username = 'testUser'+str((i % 100))
    sub.move = genMove()
    db.session.add(sub)
    db.session.commit()
