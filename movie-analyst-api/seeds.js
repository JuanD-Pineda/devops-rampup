require('dotenv').config()
const mysql = require('mysql')
const util = require('util')

async function main () {
  try {
    const pool = mysql.createPool({
      connectionLimit: 10,
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'applicationuser',
      password: process.env.DB_PASS || 'applicationuser',
      database: process.env.DB_NAME || 'movie_db'
    })
    pool.query = util.promisify(pool.query)

    // Crear tablas si no existen
    console.log('Creando tablas si no existen...')
    
    const createPublicationsTable = `
      CREATE TABLE IF NOT EXISTS publications (
        name VARCHAR(255) PRIMARY KEY,
        avatar VARCHAR(255)
      )
    `
    await pool.query(createPublicationsTable)

    const createReviewersTable = `
      CREATE TABLE IF NOT EXISTS reviewers (
        name VARCHAR(255) PRIMARY KEY,
        publication VARCHAR(255),
        avatar VARCHAR(255),
        FOREIGN KEY (publication) REFERENCES publications(name)
      )
    `
    await pool.query(createReviewersTable)

    const createMoviesTable = `
      CREATE TABLE IF NOT EXISTS movies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        release_year INT,
        score INT,
        reviewer VARCHAR(255),
        publication VARCHAR(255),
        FOREIGN KEY (reviewer) REFERENCES reviewers(name),
        FOREIGN KEY (publication) REFERENCES publications(name)
      )
    `
    await pool.query(createMoviesTable)

    console.log('Tablas creadas exitosamente')

    // Insertar datos
    console.log('Insertando datos...')

    const publicationsQuery = 'INSERT IGNORE INTO publications (name, avatar) VALUES ?'
    const publicationsValues = [
      ['The Daily Reviewer', 'glyphicon-eye-open'],
      ['International Movie Critic', 'glyphicon-fire'],
      ['MoviesNow', 'glyphicon-time'],
      ['MyNextReview', 'glyphicon-record'],
      ['Movies n\' Games', 'glyphicon-heart-empty'],
      ['TheOne', 'glyphicon-globe'],
      ['ComicBookHero.com', 'glyphicon-flash']
    ]
    await pool.query(publicationsQuery, [publicationsValues])

    const reviewersQuery = 'INSERT IGNORE INTO reviewers (name, publication, avatar) VALUES ?'
    const reviewersValues = [
      ['Robert Smith', 'The Daily Reviewer', 'https://s3.amazonaws.com/uifaces/faces/twitter/angelcolberg/128.jpg'],
      ['Chris Harris', 'International Movie Critic', 'https://s3.amazonaws.com/uifaces/faces/twitter/bungiwan/128.jpg'],
      ['Janet Garcia', 'MoviesNow', 'https://s3.amazonaws.com/uifaces/faces/twitter/grrr_nl/128.jpg'],
      ['Andrew West', 'MyNextReview', 'https://s3.amazonaws.com/uifaces/faces/twitter/d00maz/128.jpg'],
      ['Mindy Lee', 'Movies n\' Games', 'https://s3.amazonaws.com/uifaces/faces/twitter/laurengray/128.jpg'],
      ['Martin Thomas', 'TheOne', 'https://s3.amazonaws.com/uifaces/faces/twitter/karsh/128.jpg'],
      ['Anthony Miller', 'ComicBookHero.com', 'https://s3.amazonaws.com/uifaces/faces/twitter/9lessons/128.jpg']
    ]
    await pool.query(reviewersQuery, [reviewersValues])

    const moviesQuery = 'INSERT IGNORE INTO movies (title, release_year, score, reviewer, publication) VALUES ?'
    const moviesValues = [
      ['Suicide Squad', '2016', 8, 'Robert Smith', 'The Daily Reviewer'],
      ['Batman vs. Superman', '2016', 6, 'Chris Harris', 'International Movie Critic'],
      ['Captain America: Civil War', '2016', 9, 'Janet Garcia', 'MoviesNow'],
      ['Deadpool', '2016', 9, 'Andrew West', 'MyNextReview'],
      ['Avengers: Age of Ultron', '2015', 7, 'Mindy Lee', 'Movies n\' Games'],
      ['Ant-Man', '2015', 8, 'Martin Thomas', 'TheOne'],
      ['Guardians of the Galaxy', '2014', 10, 'Anthony Miller', 'ComicBookHero.com'],
      ['Doctor Strange', '2016', 7, 'Anthony Miller', 'ComicBookHero.com'],
      ['Superman: Homecoming', '2017', 10, 'Chris Harris', 'International Movie Critic'],
      ['Wonder Woman', '2017', 8, 'Martin Thomas', 'TheOne']
    ]
    await pool.query(moviesQuery, [moviesValues])

    console.log('Seeds succesfully executed')
    process.exit(0)
  } catch (err) {
    console.error('Seeds file error:', err)
    process.exit(1)
  }
}

main()
