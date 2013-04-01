/**
 * Created with JetBrains WebStorm.
 * User: mlieberman
 * Date: 3/29/13
 * Time: 10:16 PM
 * To change this template use File | Settings | File Templates.
 */

if(process.env.NODE_ENV == null) {
  process.env.NODE_ENV = 'development';
}

module.exports = function(){
  switch(process.env.NODE_ENV){
    case 'development':
      return {
        DATABASE_URL: "postgres://postgres:postgres@localhost/bgl"
      }
    case 'production':
      return {
        DATABASE_URL: "postgres://jcjdlrvrqodrwp:FGaNy1P-bgy53qq6ij1ODbA0Dd@ec2-54-225-69-193.compute-1.amazonaws.com:5432/d4t2rn9gjc4gbu"
      }
  }
}