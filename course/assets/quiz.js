/* Reusable retrieval-practice quiz. Classic script on purpose: lessons open over
   file://, where ES modules are blocked by CORS.

   Usage in a lesson:
   <div class="quiz" data-title="Check yourself">
     <script type="application/json">
       [{"q": "...", "options": ["...","..."], "answer": 1, "why": "..."}]
     </script>
   </div>
*/
(function () {
  "use strict";

  var CSS = [
    ".quiz{border:1px solid var(--rule);border-radius:4px;padding:1.25rem 1.4rem;margin:2rem 0;background:var(--bg)}",
    ".quiz-title{font-family:var(--mono);font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-faint);margin:0 0 .3rem}",
    ".quiz-hint{font-size:.85rem;color:var(--ink-faint);font-style:italic;margin:0 0 1.4rem}",
    ".quiz-q{margin-bottom:1.6rem}",
    ".quiz-q:last-of-type{margin-bottom:.5rem}",
    ".quiz-stem{font-weight:600;margin:0 0 .7rem}",
    ".quiz-num{font-family:var(--mono);font-size:.78rem;color:var(--ink-faint);margin-right:.45rem}",
    ".quiz-opt{display:block;width:100%;text-align:left;font:inherit;font-size:.95rem;color:inherit;",
    "background:var(--bg);border:1px solid var(--rule);border-radius:4px;padding:.5rem .75rem;",
    "margin-bottom:.4rem;cursor:pointer;transition:background .12s,border-color .12s}",
    ".quiz-opt:hover:not([disabled]){border-color:var(--accent);background:var(--accent-soft)}",
    ".quiz-opt[disabled]{cursor:default}",
    ".quiz-opt.is-right{border-color:var(--good);background:var(--good-soft)}",
    ".quiz-opt.is-wrong{border-color:var(--accent);background:var(--accent-soft);text-decoration:line-through;color:var(--ink-faint)}",
    ".quiz-mark{font-family:var(--mono);font-size:.8rem;margin-right:.5rem;opacity:.75}",
    ".quiz-why{font-size:.9rem;color:var(--ink-soft);margin:.6rem 0 0;padding-left:.85rem;border-left:2px solid var(--rule)}",
    ".quiz-score{font-family:var(--mono);font-size:.8rem;color:var(--ink-faint);border-top:1px solid var(--rule);padding-top:.8rem;margin-top:1.2rem}",
    "@media print{.quiz-opt{border-color:var(--rule)!important;background:none!important}.quiz-why{display:block}}"
  ].join("");

  function injectCSS() {
    if (document.getElementById("quiz-css")) return;
    var s = document.createElement("style");
    s.id = "quiz-css";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function build(root) {
    var holder = root.querySelector('script[type="application/json"]');
    if (!holder) return;
    var items;
    try {
      items = JSON.parse(holder.textContent);
    } catch (e) {
      root.textContent = "Quiz data failed to parse: " + e.message;
      return;
    }

    var answered = 0;
    var correct = 0;

    var title = document.createElement("p");
    title.className = "quiz-title";
    title.textContent = root.getAttribute("data-title") || "Check yourself";
    root.appendChild(title);

    var hint = document.createElement("p");
    hint.className = "quiz-hint";
    hint.textContent = root.getAttribute("data-hint") ||
      "Answer from memory before scrolling back. Getting one wrong is more useful than getting it right.";
    root.appendChild(hint);

    var score = document.createElement("p");
    score.className = "quiz-score";
    score.textContent = "0 of " + items.length + " answered";

    items.forEach(function (item, qi) {
      var block = document.createElement("div");
      block.className = "quiz-q";

      var stem = document.createElement("p");
      stem.className = "quiz-stem";
      var num = document.createElement("span");
      num.className = "quiz-num";
      num.textContent = (qi + 1) + ".";
      stem.appendChild(num);
      stem.appendChild(document.createTextNode(item.q));
      block.appendChild(stem);

      var why = document.createElement("p");
      why.className = "quiz-why";
      why.textContent = item.why || "";
      why.hidden = true;

      var buttons = item.options.map(function (text, oi) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "quiz-opt";
        b.textContent = text;
        b.addEventListener("click", function () {
          if (b.disabled) return;
          var right = oi === item.answer;
          answered += 1;
          if (right) correct += 1;
          buttons.forEach(function (other, oj) {
            other.disabled = true;
            var mark = document.createElement("span");
            mark.className = "quiz-mark";
            if (oj === item.answer) {
              other.classList.add("is-right");
              mark.textContent = "✓";
              other.insertBefore(mark, other.firstChild);
            } else if (oj === oi) {
              other.classList.add("is-wrong");
              mark.textContent = "✗";
              other.insertBefore(mark, other.firstChild);
            }
          });
          why.hidden = false;
          score.textContent = answered + " of " + items.length + " answered · " +
            correct + " right first time";
        });
        block.appendChild(b);
        return b;
      });

      block.appendChild(why);
      root.appendChild(block);
    });

    root.appendChild(score);
    holder.remove();
  }

  function init() {
    injectCSS();
    Array.prototype.forEach.call(document.querySelectorAll(".quiz"), build);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
