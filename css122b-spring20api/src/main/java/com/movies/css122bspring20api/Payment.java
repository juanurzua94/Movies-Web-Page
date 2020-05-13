package com.movies.css122bspring20api;

import org.springframework.web.bind.annotation.*;

import java.sql.*;
import java.util.HashMap;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping(value = "/api/pay")
public class Payment {

    private final String CLASSNAME = "com.mysql.cj.jdbc.Driver";
    private Connection con = null;
    private final String DBURL = "jdbc:mysql://localhost:3306/moviedb";
    private final String USER = "root";
    // private final String PASSWORD = "root";

    private final String PASSWORD = "root";

    private PreparedStatement preparedStatement = null;

    @PostMapping
    public HashMap<String, String> validatePayment(@RequestBody HashMap<String, String> data){
        HashMap<String, String>  temp = new HashMap<>();
        if(validatePayInformation(data.get("first"), data.get("last"), data.get("ccn"), data.get("ed"))){
            temp.put("RESULT", "T");
        }
        else {
            temp.put("RESULT", "F");
        }
        return temp;
    }


    private boolean validatePayInformation(String fn, String ln, String ccn, String ed){
        try{
            Class.forName(CLASSNAME);
            con = DriverManager.getConnection(
                    DBURL, USER, PASSWORD
            );
            String query = "select * from " +
                    "creditcards where creditcards.id = \"" + ccn + "\" " +
                    "and creditcards.expiration = \"" + ed + "\"";
           System.out.println(query);
           preparedStatement = con.prepareStatement(query);
            ResultSet data = preparedStatement.executeQuery();

            if(data.next())
                return true;
        }
        catch (Exception e){
            e.printStackTrace();
        }
        finally{
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
