package com.movies.css122bspring20api;
import org.springframework.web.bind.annotation.*;
import sun.misc.Request;

import javax.xml.crypto.Data;
import java.net.PasswordAuthentication;
import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping(value = "/api/movies")
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
    // private final String PASSWORD = "root";

    private final String PASSWORD = "Pablito94ur";

    private PreparedStatement preparedStatement = null; // project 3

    public Movies(){
        movies = new ArrayList<>();
        try {
            Class.forName(CLASSNAME);

            con = DriverManager.getConnection(
                    DBURL, USER, PASSWORD
            );

            Statement statement = con.createStatement();
            statement.execute("Alter table stars add index(name)");
            statement.execute("Alter table genres add index(name)");

        } catch (Exception e){
            e.printStackTrace();
        } finally {

                try{
                    if(!con.isClosed())
                        con.close();
                } catch (Exception e){
                    e.printStackTrace();
                }

        }

    }

    @RequestMapping(value="", method = RequestMethod.GET)
    public ArrayList<HashMap<String, String>> movieList(){
        return this.movies;
    }

    @RequestMapping(value="/suggestedsearch", method = RequestMethod.GET)
    public ArrayList<String> get_suggested_search(
            @RequestParam("queryParams") String tokens
    ){
        ArrayList<String> temp = new ArrayList<>();
        String query = "select m.title from movies as m where ";
        String[] words = tokens.split(" ");
        for(int i = 0; i < words.length; ++i){
            query += "m.title like ";
            query += "\"%" + words[i] + "%\" ";
            if((i+1) != words.length)
                query += "and ";
        }
        query += "limit 5 ";
        System.out.println(query);

        try {
            Class.forName(CLASSNAME);
            con = DriverManager.getConnection(
                    DBURL, USER, PASSWORD
            );

            preparedStatement = con.prepareStatement(query);
            //System.out.println(query);
            ResultSet data = preparedStatement.executeQuery();

            while(data.next()){
                temp.add(data.getString("title"));
            }
        } catch (Exception e){
            e.printStackTrace();
        } finally {
            try{
                if(!con.isClosed())
                    con.close();
            } catch (Exception e){
                e.printStackTrace();
            }
        }

        return temp;
    }

    @RequestMapping(value="/fullsearch", method = RequestMethod.GET)
    public ArrayList<HashMap<String, String>> get_full_search(
            @RequestParam("search_bar") String tokens,
            @RequestParam("offset") String offset
    ) {
        if(this.movies.size() > 0)
            this.movies.clear();

        String query = buildTokenizedQuery(tokens) + " LIMIT 50 OFFSET " + offset;

        HashMap<String, String> temp = null;

        try {
            Class.forName(CLASSNAME);
            con = DriverManager.getConnection(
                    DBURL, USER, PASSWORD
            );

            preparedStatement = con.prepareStatement(query);
            //System.out.println(query);
            ResultSet data = preparedStatement.executeQuery();

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

            }
        } catch (Exception e){
            e.printStackTrace();
        } finally {
            try{
                if(!con.isClosed())
                    con.close();
            } catch (Exception e){
                e.printStackTrace();
            }
        }
        return this.movies;
    }
    @RequestMapping(value = "/search", method = RequestMethod.GET)
    public ArrayList<HashMap<String, String>> index(
            @RequestParam("title") String title,
            @RequestParam("director") String director,
            @RequestParam("star") String star,
            @RequestParam("year") String year,
            @RequestParam("offset") String offset
    )
    {
        System.out.println("THIS IS THE SEARCH OFFSET : " + offset);

        if(this.movies.size() > 0)
            this.movies.clear();

        String query = buildQuery(title, director, star, year) + " LIMIT 20 OFFSET " + offset;

        HashMap<String, String> temp = null;

        try{
            Class.forName(CLASSNAME);
            con = DriverManager.getConnection(
                    DBURL, USER, PASSWORD
            );

            preparedStatement = con.prepareStatement(query);
            System.out.println(query);
            ResultSet data = preparedStatement.executeQuery();

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

        return this.movies;

    }

    @PostMapping(value = "/sales")
    public HashMap<String, String> insertToSales(@RequestBody ArrayList<HashMap<String, String>> data){
        HashMap<String, String> temp = new HashMap<>();

        try{
            Class.forName(CLASSNAME);
            con = DriverManager.getConnection(
                    DBURL, USER, PASSWORD
            );

            String query = "INSERT INTO sales (customerId, movieId, saleData) VALUES (?, ? , ?)";// + buildSalesValues(data);

            String pattern = "yyyy-MM-dd";
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);
            preparedStatement = con.prepareStatement(query);
            for(int i = 0;  i < data.size(); ++i){
                for(int j = 0; j < Integer.parseInt(data.get(i).get("quantity")); ++j){


                    preparedStatement.setString(1, data.get(i).get("ccid"));
                    preparedStatement.setString(2, data.get(i).get("movieid"));
                    String cd = simpleDateFormat.format(new Date());
                    preparedStatement.setString(3, cd);

                    preparedStatement.addBatch();
                    /*
                    result += "(\"" + data.get(i).get("ccid") + "\", ";
                    result += "\"" + data.get(i).get("movieid") + "\", ";
                    String cd =  simpleDateFormat.format(new Date());
                    result += "\"" + cd + "\"), ";*/
                }
            }


            preparedStatement.executeBatch();

            /*
            System.out.println(query);
            Statement statement = con.createStatement();
            statement.executeUpdate(query);*/


        } catch (Exception e){
            e.printStackTrace();
        } finally {
            try{

                if(!con.isClosed())
                    con.close();
            } catch (Exception e){
                e.printStackTrace();
            }
        }

        return temp;
    }

    @RequestMapping(value="/genres", method= RequestMethod.GET)
    public ArrayList<String> getGenres()
    {
        ArrayList<String> genres = new ArrayList<>();

        try{
            Class.forName(CLASSNAME);
            con = DriverManager.getConnection(
                    DBURL, USER, PASSWORD
            );
            String sqlQuery = "SELECT genres.name from genres ORDER BY genres.name";
            preparedStatement = con.prepareStatement(sqlQuery);
            ResultSet genreData = preparedStatement.executeQuery();

            while(genreData.next()){
                genres.add(genreData.getString("name"));
            }

        } catch(Exception e){
            e.printStackTrace();
        } finally{
            try{
                if(!con.isClosed())
                    con.close();
            } catch (Exception e){
                e.printStackTrace();
            }
        }

        return genres;
    }

    @RequestMapping(value="/title/{letter}/{offset}", method = RequestMethod.GET)
    public ArrayList<HashMap<String, String>> getMoviesByTitle(@PathVariable("letter") String letter, @PathVariable("offset") String offset){
        System.out.println("LETTER GET OFFSET : " + offset);
        if(this.movies.size() > 0)
            this.movies.clear();
        HashMap<String, String> temp;

        try{
            Class.forName(CLASSNAME);
            con = DriverManager.getConnection(
                    DBURL, USER, PASSWORD
            );
            String sqlQuery =      "select m.id, m.director, m.year, m.title, r.rating" +
                    " from movies as m, ratings as r " +
                    " where m.id = r.movieid " +
                    "and m.title LIKE \"" + letter + "%\" order by r.rating limit 50 OFFSET " + offset;

            preparedStatement = con.prepareStatement(sqlQuery);
            ResultSet genreData = preparedStatement.executeQuery();

            while(genreData.next()){
                temp = new HashMap<>();
                temp.put(ID, genreData.getString(ID));
                temp.put(TITLE, genreData.getString(TITLE));
                temp.put(YEAR, genreData.getString(YEAR));
                temp.put(DIRECTOR, genreData.getString(DIRECTOR));
                temp.put(RATING, genreData.getString(RATING));
                temp.put(ACTORS, actorData(genreData.getString(ID), 3));
                temp.put(GENRES, genreData(genreData.getString(ID), 3));

                this.movies.add(temp);
            }

        } catch(Exception e){
            e.printStackTrace();
        } finally{
            try{
                if(!con.isClosed())
                    con.close();
            } catch (Exception e){
                e.printStackTrace();
            }
        }

        return this.movies;
    }

    @RequestMapping(value="/genre/{name}/{offset}", method = RequestMethod.GET)
    public ArrayList<HashMap<String, String>> getMoviesInGenre(@PathVariable("name") String name, @PathVariable("offset") String offset)
    {
        System.out.println("GENRE NAME GET OFFSET: " + offset);
        if(this.movies.size() > 0)
            this.movies.clear();

        HashMap<String, String> temp;
        try{
            Class.forName(CLASSNAME);
            con = DriverManager.getConnection(
                    DBURL, USER, PASSWORD
            );

            String sqlQuery =  "select m.id, m.director, m.year, m.title, r.rating" +
                    " from movies as m, ratings as r, genres as g, genres_in_movies as gim" +
                    " where g.name = \"" + name + "\" and m.id = r.movieid " +
                    "and g.id = gim.genreid " +
                    "and m.id = gim.movieid order by r.rating limit 50 OFFSET " + offset;
            preparedStatement = con.prepareStatement(sqlQuery);
            ResultSet genreData = preparedStatement.executeQuery();
            while(genreData.next()){
                temp = new HashMap<>();
                temp.put(ID, genreData.getString(ID));
                temp.put(TITLE, genreData.getString(TITLE));
                temp.put(YEAR, genreData.getString(YEAR));
                temp.put(DIRECTOR, genreData.getString(DIRECTOR));
                temp.put(RATING, genreData.getString(RATING));
                temp.put(ACTORS, actorData(genreData.getString(ID), 3));
                temp.put(GENRES, genreData(genreData.getString(ID), 3));

                this.movies.add(temp);
            }

        } catch(Exception e){
            e.printStackTrace();
        } finally{
            try{
                if(!con.isClosed())
                    con.close();
            } catch (Exception e){
                e.printStackTrace();
            }
        }
        return this.movies;
    }

    @RequestMapping(value = "/movie/{name}", method = RequestMethod.GET)
    public HashMap<String, String> getMovieInfo(@PathVariable("name") String name){
        HashMap<String, String> movieInfo = new HashMap<>();
        try {
            Class.forName(CLASSNAME);
            con = DriverManager.getConnection(
                    DBURL, USER, PASSWORD
            );
            String sqlQuery =    "SELECT m.title, m.year, m.director, m.id, r.rating"
                    + " from movies as m, ratings as r where m.title = \"" +
                    name + "\" and r.movieid = m.id";
            preparedStatement = con.prepareStatement(sqlQuery);
            ResultSet movieData = preparedStatement.executeQuery();
            movieData.next();

            movieInfo.put("id", movieData.getString("id"));
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

    @RequestMapping(value = "/actor/{id}", method = RequestMethod.GET)
    public HashMap<String, String> getActorInfo(@PathVariable("id") String id){
        HashMap<String,String> response = new HashMap<>();
        try {
            Class.forName(CLASSNAME);
            con = DriverManager.getConnection(
                    DBURL, USER, PASSWORD
            );

            String actorQuery = "select stars.name, stars.birthYear" +
                    " from stars where stars.id = " + "\"" + id + "\"";

            preparedStatement = con.prepareStatement(actorQuery);
            ResultSet actorData = preparedStatement.executeQuery();

            String sqlQuery = "select movies.title from" +
                    " movies, stars_in_movies as s " +
                    "where s.starId = " + "\"" +  id + "\"" + " and movies.id = s.movieid " +
                    "order by movies.year desc, movies.title asc ";

            preparedStatement = con.prepareStatement(sqlQuery);
            ResultSet actorMovies = preparedStatement.executeQuery();

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
          String orderQuery = " order by (select count(*) as c from" +
                  " stars as s, stars_in_movies as sim where" +
                  " s.id = sim.starid and s.name like \"stars.name\" group by s.name " +
                  ") desc";

          String sqlQuery = "select stars.name, stars.id" +
                  " from stars, stars_in_movies as s " +
                  "where stars.id = s.starid and " +
                  "s.movieid = " + "\"" + id + "\"" + orderQuery + " LIMIT " + Integer.toString(limit);

          preparedStatement = con.prepareStatement(sqlQuery);

          ResultSet actorsData = preparedStatement.executeQuery();

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
            String sqlQuery = "select genres.name" +
                    " from genres, genres_in_movies as g" +
                    " where genres.id = g.genreid and" +
                    " g.movieid = " + "\"" + id + "\"" + " order by genres.name LIMIT "
                    + Integer.toString(limit);
            preparedStatement = con.prepareStatement(sqlQuery);
            ResultSet genreData = preparedStatement.executeQuery();
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

    private String buildQuery(String title, String director, String star, String year){
        String query = "SELECT m.id, m.director, m.year, m.title, r.rating from movies as m" +
                ", ratings as r ";

        boolean and = false;
        boolean whereIncluded = false;

        if(!star.equals("")){
            query += ", stars as s, stars_in_movies as sim where ";
            query += "s.id = sim.starid and m.id = sim.movieid and s.name LIKE ";
            query += "\"" + star + "%\" ";
            and = true;
            whereIncluded = true;
        }

        if(!whereIncluded)
            query += "where ";

        if(!title.equals("")) {

            if(and)
                query += "and ";
            query += "m.title LIKE \"" + title + "%\" ";
            and = true;
        }

        if(!director.equals("")) {

            if(and)
                query += "and ";
            query += "m.director LIKE \"" + director + "%\" ";
            if(!and)
                and = true;

        }

        if(!year.equals("")){
            if(and)
                query += "and ";
            query += "m.year = \"" + year + "\" ";
        }

        query += "and m.id = r.movieid order by r.rating";

        return query;
    }

    private String buildSalesValues(ArrayList<HashMap<String, String>> data){
        String result = "";
        String pattern = "yyyy-MM-dd";
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);

        for(int i = 0;  i < data.size(); ++i){
            for(int j = 0; j < Integer.parseInt(data.get(i).get("quantity")); ++j){

                result += "(\"" + data.get(i).get("ccid") + "\", ";
                result += "\"" + data.get(i).get("movieid") + "\", ";
                String cd =  simpleDateFormat.format(new Date());
                result += "\"" + cd + "\"), ";
            }
        }

        return result.substring(0, result.length() - 2);
    }

    private String buildTokenizedQuery(String tokens){
        String result = "select m.id, m.director, m.year, m.title, r.rating "
                + " from movies as m, ratings as r where m.id = r.movieid ";
        String[] words = tokens.split(" ");
        for(String word : words){
            result += " and m.title like ";
            result += "\"%" + word + "%\" ";
        }
        return result;
    }

}
