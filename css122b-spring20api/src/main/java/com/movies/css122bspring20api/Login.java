package com.movies.css122bspring20api;

import org.springframework.web.bind.annotation.*;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashMap;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping(value = "/api/login")
public class Login {

    private final String CLASSNAME = "com.mysql.cj.jdbc.Driver";
    private Connection con = null;
    private final String DBURL = "jdbc:mysql://localhost:3306/moviedb";
    private final String USER = "root";
    // private final String PASSWORD = "root";

    private final String PASSWORD = "root";

    private String userId = "";

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
        try {
            Class.forName(CLASSNAME);
            con = DriverManager.getConnection(
              DBURL, USER, PASSWORD
            );
            Statement statement = con.createStatement();
            ResultSet user = statement.executeQuery(
                "Select id from customers where" +
                        " customers.email = \"" + email + "\"" +
                        " and customers.password = \"" + password + "\""
            );
            if(user.next()) {
                this.userId = user.getString("id");
                return true;
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
        return false;
    }

}
