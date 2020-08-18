This project is built using Django Framework.
# Django environment setup

1. Create virtual environment. 
    `virtualenv env`
    
    Activate virtual environment
    `env\Scripts\activate`

2. Install all the dependencies from the requirements.txt
    `pip install -r requirements.txt`

3. Install mysql client for ubuntu
    `pip install mysqlclient`

    For windows install mysql client as shown in the below tutorial

    https://www.youtube.com/watch?v=kX5rk2oH63M

    Make sure to update the database name, username and password in serverweb->settings.py

4. For models migrations.

    `python manage.py makemigrations`
    `python manage.py migrate`
    
5. Create superuser and setup username and password

    `python manage.py createsuperuser`

    The above steps are one time process. Only when new models are created repeat step 4
    If it is first time, make sure above all steps are completed.

## To up the django server

    `python manage.py runserver`

   App will be running on localhost:8000

