/**
 * ☭ Какой сам ☭
 * Author: Pavlenov Semen
 *
 * Date: 13.03.13 --- 16:58
 *
 * E = mc^2
 */


Array.prototype.has = function(needle)
{
    for (var i = 0; i < this.length; i++)
    {
        if (this[i] == needle) return true;
    }
    return false;
};

Array.prototype.remove = function()
{
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

Array.prototype.max = function()
{
    return Math.max.apply(null, this)
};

Array.prototype.min = function()
{
    return Math.min.apply(null, this)
};