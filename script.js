const body = document.querySelector('body'),
      adv = document.querySelector('.adv'),
      books = document.querySelector('.books'),
      book = document.querySelectorAll('.book'),
      chapterBook2_list = book[0].querySelector('ul'),
      chapterBook2 = chapterBook2_list.querySelectorAll('li'),
      chapterBook5_list = book[5].querySelector('ul'),
      chapterBook5 = chapterBook5_list.querySelectorAll('li'),
      forgetChapter = document.createElement('li');

// Восстановить порядок книг
books.append(book[1]); // Книга 1
books.append(book[0]); // Книга 2
books.append(book[4]); // Книга 3
books.append(book[3]); // Книга 4
books.append(book[5]); // Книга 5
books.append(book[2]); // Книга 6

// Заменить картинку заднего фона на другую из папки image
body.style.backgroundImage = 'url(./image/you-dont-know-js.jpg)';

// Исправить заголовок в книге 3 (Получится - "Книга 3. this и Прототипы Объектов")
book[4].querySelector('h2 > a').textContent = 'Книга 3. this и Прототипы Объектов';

// Удалить рекламу со страницы
adv.remove();

// Восстановить порядок глав во второй и пятой книге (внимательно инспектируйте индексы элементов, поможет dev tools)
chapterBook2_list.append(chapterBook2[3]);
chapterBook2_list.append(chapterBook2[6]);
chapterBook2_list.append(chapterBook2[8]);
chapterBook2_list.append(chapterBook2[4]);
chapterBook2_list.append(chapterBook2[5]);
chapterBook2_list.append(chapterBook2[7]);
chapterBook2_list.append(chapterBook2[9]);
chapterBook2_list.append(chapterBook2[2]);
chapterBook2_list.append(chapterBook2[10]);

chapterBook5_list.append(chapterBook5[9]);
chapterBook5_list.append(chapterBook5[3]);
chapterBook5_list.append(chapterBook5[4]);
chapterBook5_list.append(chapterBook5[2]);
chapterBook5_list.append(chapterBook5[6]);
chapterBook5_list.append(chapterBook5[7]);
chapterBook5_list.append(chapterBook5[5]);
chapterBook5_list.append(chapterBook5[8]);
chapterBook5_list.append(chapterBook5[10]);

// В шестой книге добавить главу “Глава 8: За пределами ES6” и поставить её в правильное место
forgetChapter.textContent = 'Глава 8: За пределами ES6';
book[2].querySelector('ul > li:last-child').before(forgetChapter);