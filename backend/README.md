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

    The above steps are one time process. Only when new models are created repeat step 3
    If it is first time, make sure above all steps are completed.

## To up the django server

- Activate the virtual environment using following command.
    ```
    venv\Scripts\activate
    ```
  
- Run the below command to up the django server.

    `python manage.py runserver`

 App will be running on localhost:8000

