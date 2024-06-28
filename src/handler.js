const { nanoid } = require('nanoid');
const books = require('./buku');


const addBooksHandler = (request, h) => {
    const { 
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        reading } = request.payload;
        if (name === undefined) {
          const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
          }).code(400);
          return response;
        }
        if (readPage > pageCount) {
          const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
          }).code(400);
          return response;
        }
    const id = nanoid(16);
    const finished = pageCount === readPage ? true : false;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBooks = {
       id, name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt, updatedAt
      };

      books.push(newBooks);

      const isSuccess = books.filter((book) => book.id === id).length > 0;

      if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
      }

      const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
      });
      response.code(400);
      return response;
};

// Untuk menambhakan Buku
const getAllBooksHandler = (request) => {
    const { name, reading, finished } = request.query;
    let filteredBooks = [...books];

    if (name) {
        const keyword = name.toLowerCase();
        filteredBooks = filteredBooks.filter(book => book.name.toLowerCase().includes(keyword));
    }

    if (reading !== undefined) {
        const isReading = reading === '1';
        filteredBooks = filteredBooks.filter(book => book.reading === isReading);
    }

    if (finished !== undefined) {
        const isFinished = finished === '1';
        filteredBooks = filteredBooks.filter(book => book.finished === isFinished);
    }

    // untuk mengembalikan respons dengan daftar buku yang telah difilter
    return {
        status: 'success',
        data: {
            books: filteredBooks.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    };
};

const getBooksByIdHandler = (request, h) => {
    const { bookId} = request.params;
   
    const book = books.filter((n) => n.id === bookId)[0];

   
    if (book !== undefined) {
      return {
        status: 'success',
        data: {
          book,
        },
      };
    }
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  };

  //untuk mengedit buku
  const editBooksByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        if (!name) {
            return h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku'
            }).code(400);
        }

        // untuk mengecek apakah nilai properti readPage lebih besar dari nilai properti pageCount
        if (readPage > pageCount) {
            return h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
            }).code(400);
        }
        // Update data buku
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt
        };

        return h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        }).code(200);
    } else {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan'
        }).code(404);
    }
};

//untuk mengapus buku
const deleteBooksByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1 ) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};


module.exports = { 
     addBooksHandler,
     getAllBooksHandler,
     getBooksByIdHandler,
     editBooksByIdHandler,
     deleteBooksByIdHandler,};