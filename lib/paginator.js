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

var Paginator = function(page, limit, total, boundary) {

    boundary = boundary || 3;

    this.page = page;
    this.limit = limit;
    this.total = total;

    this.prev = null;
    this.next = null;
    this.first = 1;
    this.last = Math.ceil(total / limit);
    this.pageCount = this.last;

    this.start = this.first;
    this.end = this.last;

    if (page > 1) this.prev = page - 1;
    if ( (page * limit) < total ) this.next = page + 1;

    if (this.last < ((boundary * 2) + 1))
    {
        this.start = this.first;
        this.end = this.last;
    }
    else if (page < this.first + boundary)
    {
        this.start = this.first;
        this.end = this.first + (boundary * 2)
    }
    else if (page > this.last - boundary)
    {
        this.start = this.last - (boundary * 2);
        this.end = this.last;
    }
    else
    {
        this.start  = page - boundary;
        this.end = page + boundary;
    }

    this.range = range(this.start, this.end);

};

module.exports = Paginator;