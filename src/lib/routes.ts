/* 

    Index -> Login -> Dashboard

    Dashboard will take GetStudySessions API Call and GET PDFs API call to populate dashboard

    Dashboard will have Study Session ID ready to route to individual Study Session. 

    On study Session Page User will get history of chat logs of convo


    Create Routes that will be used in API Calls to gather info from the database

    Get Study Sessions 
        Takes
            - Has UserID
        Return
            - Array of Dics of Study Sessions for particular User
            [
                {
                    StudySession: Text
                    Subject: Text
                    chat_log_id: UUID
                },
                {
                    StudySession: Text
                    Subject: Text
                    chat_log_id: UUID
                }
            ]

*/
