/**
 * ☭ Какой сам ☭
 * Author: Pavlenov Semen
 *
 * Date: 07.03.13 --- 23:19
 *
 * E = mc^2
 */

function range(start, end)
{
    var foo = [];
    for (var i = start; i <= end; i++)
        foo.push(i);
    return foo;
}

var Paginator = function(page, limit, total, length) {

    this.page = page;
    this.limit = limit;
    this.total = total;

    this.prev = null;
    this.next = null;
    this.first = 1;
    this.last = Math.ceil(total / limit);

    this.start = this.first;
    this.end = this.last;

    if (page > 1) this.prev = page - 1;
    if ( (page * limit) < total) this.next = page + 1;

    if (this.last > length)
    {
        this.start = Math.ceil( (this.last - length) / 2) + 1;
        this.end = this.start + length - 1;
    }

    this.range = range(this.start, this.end);

};

module.exports = Paginator;