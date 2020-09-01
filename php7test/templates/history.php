<nav class="nav">
    <ul class="nav__list container">
        <li class="nav__item nav__item--current">
            <a href="all-lots.html">Доски и лыжи</a>
        </li>
        <li class="nav__item">
            <a href="all-lots.html">Крепления</a>
        </li>
        <li class="nav__item">
            <a href="all-lots.html">Ботинки</a>
        </li>
        <li class="nav__item">
            <a href="all-lots.html">Одежда</a>
        </li>
        <li class="nav__item">
            <a href="all-lots.html">Инструменты</a>
        </li>
        <li class="nav__item">
            <a href="all-lots.html">Разное</a>
        </li>
    </ul>
</nav>
<div class="container">
    <section class="lots">
        <h2>История просмотров</h2>
        <ul class="lots__list">
            <?php if ($visitedArr) : ?>
                <?php for ($i = count($visitedArr) - 1; $i >= 0; $i--) :
                    $id = $visitedArr[$i]; ?>
                    <li class="lots__item lot">
                        <div class="lot__image">
                            <img src="img/<?= $arrayOfProduct[$id]['url']; ?>" width="350" height="260" alt="<?= $arrayOfProduct[$id]['category']; ?>">
                        </div>
                        <div class="lot__info">
                            <span class="lot__category"><?= $arrayOfProduct[$id]['category']; ?></span>
                            <h3 class="lot__title">
                                <a class="text-link" href="lot.php?id=<?= $id ?>"><?= htmlspecialchars($arrayOfProduct[$id]['name']); ?></a>
                            </h3>
                            <div class="lot__state">
                                <div class="lot__rate">
                                    <span class="lot__amount">Стартовая цена</span>
                                    <span class="lot__cost"><?= formatPrice($arrayOfProduct[$id]['price']); ?>
                                        <b class="rub">р</b>
                                    </span>
                                </div>
                                <?php $time_limited = getExpirationTime(); ?>
                                <div class="lot__timer timer">
                                    <?= "$time_limited[0] Часов : $time_limited[1] Мин" ?>
                                </div>
                            </div>
                        </div>
                    </li>
                <?php endfor ?>
            <?php else : ?>
                <h3 class="history--empty">История просмотров пуста</h3>
            <?php endif; ?>
        </ul>
    </section>
    <ul class="pagination-list">
        <li class="pagination-item pagination-item-prev"><a>Назад</a></li>
        <li class="pagination-item pagination-item-active"><a>1</a></li>
        <li class="pagination-item"><a href="#">2</a></li>
        <li class="pagination-item"><a href="#">3</a></li>
        <li class="pagination-item"><a href="#">4</a></li>
        <li class="pagination-item pagination-item-next"><a href="#">Вперед</a></li>
    </ul>
</div>