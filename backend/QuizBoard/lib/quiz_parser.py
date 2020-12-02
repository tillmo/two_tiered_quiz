# Read in files with quizzes of the following form:
# quiz: name of quiz
# d: description of quiz
# q: question 1
# a: answer 1*
# j: justification 1
# e: explanation 1
# j: justification 2*
# a: answer 2
# ...
# q: question 2
# ...

from django.db import transaction
from QuizBoard.models import Quiz, Question, Answer, Justifications, Explaination


def read_quiz_file(file):
    print('Reading {0} into database'.format(file))
    with open(file) as f:
        read_quiz(f.read())


def read_quiz(quiz_str):
    try:
        read_quiz_aux(quiz_str)
    except Exception as e:
        print(e)
        print("Aborting")


def read_quiz_web(quiz_str):
    message = ""
    try:
        read_quiz_aux(quiz_str)
    except Exception as e:
        message = str(e)
        return message
    return message

@transaction.atomic
def read_quiz_aux(quiz_str):
    quiz = None
    question = None
    answer = None
    just = None
    try:
        for line in quiz_str.splitlines():
            line = line.strip()
            if len(line) == 0:  # empty line
                continue
            if line[0] == "#":  # comment
                continue
            prefix, contents = line.split(':', 1)
            if prefix == 'quiz':
                if Quiz.objects.filter(name=contents):
                    raise Exception("duplicate quiz")
                quiz = Quiz.objects.create(name=contents)
                # remove all contexts that have become invalid
                question = None
                answer = None
                just = None
            elif prefix == 'd':
                quiz.description = contents
                quiz.save()
            elif prefix == 'q':
                question = Question.objects.create(quiz=quiz, label=contents)
                answer = None
                just = None
            elif prefix == 'a':
                c = contents[-1] == "*"
                if c:
                    contents = contents[:-1]
                answer = Answer.objects.create(
                    question=question, text=contents, is_correct=c)
                just = None
            elif prefix == 'j':
                c = contents[-1] == "*"
                if c:
                    contents = contents[:-1]
                just = Justifications.objects.create(
                    answer=answer, text=contents, is_correct=c)
            elif prefix == 'e':
                Explaination.objects.create(justification=just, text=contents)
            else:
                raise Exception("Unknown prefix: {0}:\nUse quiz:, d:, q:, a:, j:, e:".format(prefix))
    except Exception as e:
        wrong_line = "Wrong line: {0}".format(line)
        message = str(e)
        if message == "not enough values to unpack (expected 2, got 1)":
            raise Exception("Wrong quiz format\nPlease use the correct format quiz as mentioned")   
        else: 
            raise Exception(wrong_line+"\n"+message)
