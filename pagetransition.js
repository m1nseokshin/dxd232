$(function () {
    $("body, div").fadeIn(3000, function () {
        $(this).animate({
            "opacity": "100"
        }, 3000);
    });

    $("a").click(function () {
        e.preventDefault();
        let url = $(this).attr("href");
                $("body div").animate({
            "opacity": "0",
            "top": "0px",
            "background": "white"
        }, 3000, function () {
            document.location.href = url;
        });

        if (
            url.includes("dxdesign.kr") ||
            url.includes("facebook.com/dxdesign.cu.ac.kr") ||
            url.includes("instagram.com/dcudxd")
        ) {
            window.open(url, '_blank');
        }

        return false;
    });
});