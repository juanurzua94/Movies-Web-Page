package com.movies.css122bspring20api;

import org.springframework.web.bind.annotation.*;

import java.sql.*;
import java.util.HashMap;
import org.jasypt.util.password.StrongPasswordEncryptor;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping(value = "/api/login")
public class Login {

    private final String CLASSNAME = "com.mysql.cj.jdbc.Driver";
    private Connection con = null;
    private final String DBURL = "jdbc:mysql://localhost:3306/moviedb";
    private final String USER = "root";
    // private final String PASSWORD = "root";

    private final String PASSWORD = "Pablito94ur";

    private String userId = "";

    private final String reCaptchaKey = "6LcHFfYUAAAAAB7_6689P_l2tmhEV9VO0xNXcKUY";

    private PreparedStatement preparedStatement = null;

    @PostMapping
    public HashMap<String, String> test(@RequestBody HashMap<String, String> data){
        HashMap<String, String> response = new HashMap<>();

        if(!checkIfUserExists(data.get("email"), data.get("password"))){
                response.put("user", "error");
        }
        else {
                response.put("user", "success");
                response.put("userid", userId);
        }

        return response;
    }

    private boolean checkIfUserExists(String email, String password){
        boolean success = false;
        try {
            Class.forName(CLASSNAME);
            con = DriverManager.getConnection(
              DBURL, USER, PASSWORD
            );

            String sqlQuery = "Select * from customers where" +
                    " customers.email = \"" + email + "\"";

            preparedStatement = con.prepareStatement(sqlQuery);
            ResultSet user = preparedStatement.executeQuery();

            if(user.next()) {
                String encryptedPassword = user.getString("Password");
                success = new StrongPasswordEncryptor().checkPassword(password, encryptedPassword);
                this.userId = user.getString("id");
                return success;
            }
        } catch (Exception e){
            e.printStackTrace();
        }
        finally {
            try{
                if(!con.isClosed())
                    con.close();
            } catch (Exception e){
                e.printStackTrace();
            }
        }
        return success;
    }

}
