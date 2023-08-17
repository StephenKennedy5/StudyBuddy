/*

Create Login API EndPoint
    Checks to see if User of same Email exists
        GET? if exist then login
        else
            POST? Add new user to database
            then sign person in

Create API endpoint to get all current study sessions
    GET 
        - Return all Study Sessions

    Post 
        - Create a new Study Session
            - Add new Row to Study Session Table
            - Update Study Session User Pivot Table with new Study Session

    Delete
        - Delete A study Session and all chat logs

Create API endpoint to get all ChatLogs of A current Study Session


Create API Endpoint for PDFs
    Get
        - Return all PDFs to a particular User
    
    Post
        - Add a new PDF to User
            - Create new PDF row
            - Update PDF USER Pivot Table

Create EndPoint To Get ChatLogs
    Get
        - Return all current messages with study bot
    
    Post
        - Ask new question/message to ChatBot

*/
