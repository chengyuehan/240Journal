---
layout: default
title: Making Journal for DES240
---

<style>
  .journal-intro {
    margin-bottom: 3rem;
  }

  .journal-intro h1,
  .journal-section h2 {
    color: #15965f;
  }

  .journal-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
    margin-top: 24px;
  }

  .journal-card {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    min-height: 260px;
    padding: 32px;

    overflow: hidden;
    box-sizing: border-box;

    border-radius: 22px;
    border: 1px solid rgba(0,0,0,.08);

    background: linear-gradient(135deg,#207397,#15966b);

    color: white !important;
    text-decoration: none !important;

    box-shadow: 0 8px 24px rgba(20,40,50,.10);
    transition: .25s;
  }

  .journal-card:hover{
    transform: translateY(-6px);
    box-shadow:0 16px 36px rgba(20,40,50,.18);
  }

  .journal-card::before{
    content:"";
    position:absolute;
    width:230px;
    height:230px;
    border-radius:50%;
    border:2px solid rgba(255,255,255,.18);
  }

  .journal-card::after{
    content:"";
    position:absolute;
    width:145px;
    height:145px;
    border-radius:30px;
    background:rgba(255,255,255,.10);
    transform:rotate(12deg);
  }

  .journal-card span{
    position:relative;
    z-index:2;

    width:100%;

    margin:0;
    padding:0;

    color:white;
    text-align:center;

    font-size:2.8rem;
    font-weight:700;
    line-height:1.15;
  }

  .journal-card:nth-child(2){background:linear-gradient(135deg,#8e5dad,#d06988);}
  .journal-card:nth-child(3){background:linear-gradient(135deg,#df795d,#d7ab53);}
  .journal-card:nth-child(4){background:linear-gradient(135deg,#4361a8,#7775c3);}
  .journal-card:nth-child(5){background:linear-gradient(135deg,#177d78,#70a847);}
  .journal-card:nth-child(6){background:linear-gradient(135deg,#b64e5c,#df8b79);}
  .journal-card:nth-child(7){background:linear-gradient(135deg,#305d91,#3978ad);}
  .journal-card:nth-child(8){background:linear-gradient(135deg,#6556a4,#b3639d);}
  .journal-card:nth-child(9){background:linear-gradient(135deg,#39756c,#78a568);}
  .journal-card:nth-child(10){background:linear-gradient(135deg,#a65562,#ce7969);}
  .journal-card:nth-child(11){background:linear-gradient(135deg,#3d658b,#5599a5);}
  .journal-card:nth-child(12){background:linear-gradient(135deg,#876249,#c69763);}
  .journal-card:nth-child(13){background:linear-gradient(135deg,#585b97,#9675aa);}
  .journal-card:nth-child(14){background:linear-gradient(135deg,#45698b,#6a8fd0);}

  @media(max-width:760px){

    .journal-grid{
      grid-template-columns:1fr;
    }

    .journal-card{
      min-height:190px;
    }

    .journal-card span{
      font-size:2.1rem;
    }

  }
</style>

# Introduction

As a second-year student in IT Management and Design, I chose this course because I spent the entire semester last year studying Data Analytica. I initially thought this was a good thing, but now it seems it significantly limited my imagination. As a design student, I am interested in UI/UX, animation, and game design.

---

## Weekly Journal

<div class="journal-grid">

<a class="journal-card" href="{{ '/journal-pages/week-0.html' | relative_url }}">
<span>Preface</span>
</a>

<a class="journal-card" href="{{ '/journal-pages/week-01.html' | relative_url }}">
<span>Week 01</span>
</a>

<a class="journal-card" href="{{ '/journal-pages/week-02.html' | relative_url }}">
<span>Week 02</span>
</a>

<a class="journal-card" href="{{ '/journal-pages/week-03.html' | relative_url }}">
<span>Week 03</span>
</a>

<a class="journal-card" href="{{ '/journal-pages/week-04.html' | relative_url }}">
<span>Week 04</span>
</a>

<a class="journal-card" href="{{ '/journal-pages/week-05.html' | relative_url }}">
<span>Week 05</span>
</a>

<a class="journal-card" href="{{ '/journal-pages/week-06.html' | relative_url }}">
<span>Week 06</span>
</a>

<a class="journal-card" href="{{ '/journal-pages/week-07.html' | relative_url }}">
<span>Week 07</span>
</a>

<a class="journal-card" href="{{ '/journal-pages/week-08.html' | relative_url }}">
<span>Week 08</span>
</a>

<a class="journal-card" href="{{ '/journal-pages/week-09.html' | relative_url }}">
<span>Week 09</span>
</a>

<a class="journal-card" href="{{ '/journal-pages/week-10.html' | relative_url }}">
<span>Week 10</span>
</a>

<a class="journal-card" href="{{ '/journal-pages/week-11.html' | relative_url }}">
<span>Week 11</span>
</a>

<a class="journal-card" href="{{ '/journal-pages/week-12.html' | relative_url }}">
<span>Week 12</span>
</a>

<a class="journal-card" href="{{ '/journal-pages/week-13.html' | relative_url }}">
<span>Reflections<br>&<br> Resources</span>
</a>

</div>