package com.movies.css122bspring20api;

import org.jasypt.util.password.StrongPasswordEncryptor;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.Null;
import java.sql.*;
import java.util.HashMap;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping(value = "/api/fablix/_dashboard")
public class Employee {
    private final String CLASSNAME = "com.mysql.cj.jdbc.Driver";
    private Connection con = null;
    private final String DBURL = "jdbc:mysql://localhost:3306/moviedb";
    private final String USER = "root";
    // private final String PASSWORD = "root";

    private final String PASSWORD = "Pablito94ur";

    private String userId = "";

    private final String reCaptchaKey = "6LcHFfYUAAAAAB7_6689P_l2tmhEV9VO0xNXcKUY";

    private PreparedStatement preparedStatement = null;
    private CallableStatement callableStatement = null;

    @PostMapping(value="/login")
    public HashMap<String, String> test(@RequestBody HashMap<String, String> data){
        HashMap<String, String> response = new HashMap<>();

        if(!checkIfUserExists(data.get("email"), data.get("password"))){
            response.put("employee", "error");
        }
        else {
            response.put("employee", "success");
        }

        return response;
    }

    @PostMapping(value="/addActor")
    public HashMap<String, String> insertActor(@RequestBody HashMap<String, String> data){
        HashMap<String, String> result = new HashMap<>();
        try{
            Class.forName(CLASSNAME);
            con = DriverManager.getConnection(
                    DBURL, USER, PASSWORD
            );
            String sqlQuery = "INSERT INTO stars(id, name, birthYear) VALUES (?, ?, ?)";
            PreparedStatement p = con.prepareStatement("Select max(id) as id from stars");

            ResultSet r = p.executeQuery();
            r.next();
            String id = getNextHighestid(r.getString("id"));
            System.out.println(id);
            preparedStatement = con.prepareStatement(sqlQuery);
            preparedStatement.setString(1, id);
            preparedStatement.setString(2, data.get("name"));
            preparedStatement.setInt(3, Integer.parseInt(data.get("birthYear")));

            int success = preparedStatement.executeUpdate();
            if(success > 0)
                result.put("RESULT", "SUCCESS");
            else
                result.put("RESULT", "FAILURE");

        } catch (Exception e){
            e.printStackTrace();
        } finally {
            try {
                if (!con.isClosed())
                    con.close();
            } catch(Exception e){
                e.printStackTrace();
            }
        }
        return result;
    }

    @PostMapping(value="/addMovie")
    public HashMap<String, String> insertMovie(@RequestBody HashMap<String, String> data){
        HashMap<String, String> result = new HashMap<>();
        try{
            Class.forName(CLASSNAME);
            con = DriverManager.getConnection(
                    DBURL, USER, PASSWORD
            );
            String sqlQuery = "CALL add_movie(?, ?, ?, ?, ?)";
            callableStatement = con.prepareCall(sqlQuery);

            callableStatement.setString(1, data.get("title"));
            callableStatement.setString(2, data.get("director"));
            callableStatement.setInt(3, Integer.parseInt(data.get("year")));
            callableStatement.setString(4, data.get("actor_name"));
            callableStatement.setString(5, data.get("genre"));

            System.out.println(callableStatement.toString());
            ResultSet response = callableStatement.executeQuery();

            try {
                response.next();
                result.put("SUCCESS", "SUCCESS");

            } catch (Exception e){

                result.put("SUCCESS", "FALSE");
            }

        } catch (Exception e){
            e.printStackTrace();
        } finally {
            try {
                if (!con.isClosed())
                    con.close();
            } catch(Exception e){
                e.printStackTrace();
            }
        }

        return result;
    }


    private boolean checkIfUserExists(String email, String password){
        boolean success = false;
        try {
            Class.forName(CLASSNAME);
            con = DriverManager.getConnection(
                    DBURL, USER, PASSWORD
            );

            String sqlQuery = "Select * from employees where" +
                    " employees.email = \"" + email + "\"";

            preparedStatement = con.prepareStatement(sqlQuery);
            ResultSet user = preparedStatement.executeQuery();

            if(user.next()) {
                String encryptedPassword = user.getString("password");
                success = new StrongPasswordEncryptor().checkPassword(password, encryptedPassword);
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

    private String getNextHighestid(String id){
        String newString = "";
        String num = id.substring(2);
        int num_len = num.length();
        int eval_num = Integer.parseInt(num);
        ++eval_num;
        newString = Integer.toString(eval_num);
        int difference = num_len - newString.length();
        return id.substring(0, 2 + difference) + newString;
    }
}
