package com.movies.css122bspring20api;
import org.springframework.web.bind.annotation.*;

import java.net.PasswordAuthentication;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
@RestController
@RequestMapping(value = "/api")
public class Movies {

    //private HashMap<String, ArrayList<String>> movieList;
    private ArrayList<HashMap<String, String>> movies;

    private final String ID = "id";
    private final String DIRECTOR = "director";
    private final String YEAR = "year";
    private final String TITLE = "title";
    private final String RATING = "rating";
    private final String ACTORS = "actors";
    private final String GENRES = "genres";
    private final String CLASSNAME = "com.mysql.cj.jdbc.Driver";
    private Connection con = null;
    private final String DBURL = "jdbc:mysql://localhost:3306/moviedb";
    private final String USER = "root";
    private final String PASSWORD = "root";
    public Movies(){
        //movieList = new HashMap<>();
        movies = new ArrayList<>();
        HashMap<String, String> temp = null;
        /*
        movieList.put("id", new ArrayList<String>());
        movieList.put("title", new ArrayList<>());
        movieList.put("year", new ArrayList<>());
        movieList.put("director", new ArrayList<>());
        */

        try{
            Class.forName(CLASSNAME);
            con = DriverManager.getConnection(
                    DBURL, USER, PASSWORD
            );
            Statement statement = con.createStatement();
            ResultSet data = statement.executeQuery(
                    "select m.id, m.director, m.year, m.title, r.rating" +
                            " from movies as m, ratings as r" +
                            " where m.id = r.movieid order by r.rating desc"
            );
            while(data.next()){
                    temp = new HashMap<>();

                    temp.put(ID, data.getString(ID));
                    temp.put(TITLE, data.getString(TITLE));
                    temp.put(YEAR, data.getString(YEAR));
                    temp.put(DIRECTOR, data.getString(DIRECTOR));
                    temp.put(RATING, data.getString(RATING));
                    temp.put(ACTORS, actorData(data.getString(ID), 3));
                    temp.put(GENRES, genreData(data.getString(ID), 3));


                    movies.add(temp);
                /*
                movieList.get("id").add(data.getString("id"));
                movieList.get("title").add(data.getString("title"));
                movieList.get("year").add(data.getString("year"));
                movieList.get("director").add(data.getString("director"));*/
            }
        }
        catch(Exception e){
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
    }

    @RequestMapping(value = "/movies", method = RequestMethod.GET)
    public ArrayList<HashMap<String, String>> index(){
        return this.movies;
    }

    @RequestMapping(value = "/movies/movie/{name}", method = RequestMethod.GET)
    public HashMap<String, String> getMovieInfo(@PathVariable("name") String name){
        HashMap<String, String> movieInfo = new HashMap<>();
        try {
            Class.forName(CLASSNAME);
            con = DriverManager.getConnection(
                    DBURL, USER, PASSWORD
            );
            Statement statement = con.createStatement();

            ResultSet movieData = statement.executeQuery(
                    "SELECT m.title, m.year, m.director, m.id, r.rating"
                    + " from movies as m, ratings as r where m.title = \"" +
                            name + "\" and r.movieid = m.id"
            );
            movieData.next();


            movieInfo.put("title" , movieData.getString("title"));
            movieInfo.put("director", movieData.getString("director"));
            movieInfo.put("year", movieData.getString("year"));
            movieInfo.put("genres", genreData(movieData.getString("id"), 1000));
            movieInfo.put("actors", actorData(movieData.getString("id"), 1000));
            movieInfo.put("rating", movieData.getString("rating"));

        } catch(Exception e){
            e.printStackTrace();
        }
        finally {
            try {
                if (!con.isClosed())
                    con.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return movieInfo;
    }

    @RequestMapping(value = "/movies/actor/{id}", method = RequestMethod.GET)
    public HashMap<String, String> getActorInfo(@PathVariable("id") String id){
        HashMap<String,String> response = new HashMap<>();
        try {
            Class.forName(CLASSNAME);
            con = DriverManager.getConnection(
                    DBURL, USER, PASSWORD
            );
            Statement statement = con.createStatement();

            ResultSet actorData = statement.executeQuery("select stars.name, stars.birthYear" +
                    " from stars where stars.id = " + "\"" + id + "\"");

            Statement s = con.createStatement();
            ResultSet actorMovies = s.executeQuery("select movies.title from" +
                    " movies, stars_in_movies as s " +
                    "where s.starId = " + "\"" +  id + "\"" + " and movies.id = s.movieid");

            actorData.next();
            response.put("name" , actorData.getString("name"));
            response.put("birthYear", actorData.getString("birthYear"));
            response.put("movies", partitionActorsMovieList(actorMovies));
        } catch(Exception e){
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
        return response;
    }

    private String actorData(String id, int limit){
        String actors = "";
        String actorFormat = "{'name': '%s', 'id': '%s'}";
        String actorsList = "[";

      try {
          Statement s = con.createStatement();
          ResultSet actorsData = s.executeQuery("select stars.name, stars.id" +
                  " from stars, stars_in_movies as s " +
                  "where stars.id = s.starid and " +
                  "s.movieid = " + "\"" + id + "\"" + " LIMIT " + Integer.toString(limit));
          while(actorsData.next()){
              actors += String.format(actorFormat, actorsData.getString("name"), actorsData.getString("id"));
              actors += ", ";
          }
          actorsList = actorsList + actors + "]";

      } catch (Exception e){
          e.printStackTrace();
      }
        return actorsList;
    }

    private String genreData(String id, int limit){
        String genres = "";
        try {
            Statement s = con.createStatement();
            ResultSet genreData = s.executeQuery("select genres.name" +
                    " from genres, genres_in_movies as g" +
                    " where genres.id = g.genreid and" +
                    " g.movieid = " + "\"" + id + "\"" + " LIMIT "
                    + Integer.toString(limit)
            );
            while(genreData.next()){
                genres += genreData.getString("name");
                genres += ", ";
            }
        } catch(Exception e){
            e.printStackTrace();
        }
        return genres;
    }

    private String partitionActorsMovieList(ResultSet rs){
        String movies = "";
        try{
            while(rs.next()){
                movies += rs.getString("title");
                movies += " ::: ";
            }
        } catch (Exception e){
            e.printStackTrace();
        }
        return movies + "";
    }

    private String partitionMovieActorsList(ResultSet rs){
        String actors = "";
        try {
            while(rs.next()){
                actors += rs.getString("name");
                actors = actors + " {" + rs.getString("id") + "}";
                actors += " ::: ";
            }
        }
        catch (Exception e){
            e.printStackTrace();
        }
        return actors;
    }
}
