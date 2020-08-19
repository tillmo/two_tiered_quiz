This project is built using Django Framework.
# Django environment setup

1. Create virtual environment. 
    ```
    virtualenv venv
    ```
    
    Activate virtual environment
    ```
    venv\Scripts\activate
    ```

2. Install all the dependencies from the requirements.txt
    ```
    pip install -r requirements.txt
    ```

3. For models migrations.

    ```
    python manage.py makemigrations
    python manage.py migrate
    ```

4. Create superuser and setup username and password

    ```
    python manage.py createsuperuser
    ```

    The above steps are one time process. Only when new models are created repeat step 3.  
    If it is first time, make sure above all steps are completed.

## To up the django server

- Activate the virtual environment using following command.
    ```
    venv\Scripts\activate
    ```
  
- Run the below command to up the django server.

    `python manage.py runserver`

 App will be running on localhost:8000

## To upload quiz

There is quiz template 'quiz.txt', a format for adding questions, answers, justifications and explainations.
Once the quiz template is ready, run the following command
```
python manage.py add_quiz.py quiz.txt
```
Running the above command creates a new quiz in the database with all the questions, answers, justifications and explainations added in quiz.txt

## Local Settings

There is option to switch to different settings. Please refer to the 'local_settings.py.template' in 'lqserver' directory.  
Initially program looks for settings path in environment variable "QUIZ_SETTING" else it picks the setting for 'lqserver.local_settings'.

## Logging

The Project is enable with loggings.
Outside the project folder, create a directory 'tmp' and create a file 'quiz.log'.
Application uses this file for logging.  
OR  
Change the path in settings.py file for the variable `LOGFILE`. Application uses this file for logging.


