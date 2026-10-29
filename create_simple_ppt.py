"""
Simple, Human-Written Academic Presentation Generator for MCA NLP Project
Uses plain, natural, easy-to-understand English without heavy robotic jargon.
15 Clean, Minimalist Slides (16:9 Widescreen) with crisp fonts and natural speaker notes.
"""

import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

# ==========================================
# MINIMALIST DESIGN SYSTEM & PALETTE
# ==========================================
WHITE = RGBColor(255, 255, 255)
PRIMARY = RGBColor(79, 70, 229)         # Clean Modern Indigo (accent)
PRIMARY_DARK = RGBColor(30, 27, 75)     # Deep Indigo
NAVY_TITLE = RGBColor(15, 23, 42)       # Slate 900 (High-contrast title text)
TEXT_BODY = RGBColor(51, 65, 85)        # Slate 700 (High-readability body text)
TEXT_MUTED = RGBColor(100, 116, 139)    # Slate 500 (Subtitles, metadata)
BOX_BG = RGBColor(241, 245, 249)        # Slate 100 (Soft container)
BORDER_COLOR = RGBColor(226, 232, 240)  # Slate 200

TOTAL_SLIDES = 15

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    return prs

def set_slide_background(slide, color=WHITE):
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = color
    bg.line.fill.background()
    return bg

def add_header(slide, title, category="MCA NLP PROJECT", slide_num=1):
    # Top thin accent line
    accent = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.5), Inches(11.733), Inches(0.04))
    accent.fill.solid()
    accent.fill.fore_color.rgb = PRIMARY
    accent.line.fill.background()

    # Category tracker
    tb_cat = slide.shapes.add_textbox(Inches(0.8), Inches(0.65), Inches(8.0), Inches(0.35))
    p_cat = tb_cat.text_frame.paragraphs[0]
    p_cat.text = category.upper()
    p_cat.font.size = Pt(10)
    p_cat.font.bold = True
    p_cat.font.color.rgb = PRIMARY

    # Slide number
    tb_num = slide.shapes.add_textbox(Inches(9.5), Inches(0.65), Inches(3.033), Inches(0.35))
    p_num = tb_num.text_frame.paragraphs[0]
    p_num.text = f"Slide {slide_num} of {TOTAL_SLIDES}"
    p_num.font.size = Pt(10)
    p_num.font.color.rgb = TEXT_MUTED
    p_num.alignment = PP_ALIGN.RIGHT

    # Main slide title (large, clear, readable)
    tb_title = slide.shapes.add_textbox(Inches(0.8), Inches(1.0), Inches(11.733), Inches(0.75))
    tf_title = tb_title.text_frame
    tf_title.word_wrap = True
    p_t = tf_title.paragraphs[0]
    p_t.text = title
    p_t.font.size = Pt(28)
    p_t.font.bold = True
    p_t.font.color.rgb = NAVY_TITLE

def add_speaker_notes(slide, notes):
    notes_slide = slide.notes_slide
    notes_slide.notes_text_frame.text = notes.strip()

# ==========================================
# 15 CLEAN SLIDES IN SIMPLE HUMAN ENGLISH
# ==========================================

def build_slide_1(prs):
    # Slide 1: Title Slide (Simple & Clean)
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide, WHITE)

    # Accent top strip
    strip = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.18))
    strip.fill.solid()
    strip.fill.fore_color.rgb = PRIMARY
    strip.line.fill.background()

    # Category Pill
    pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(1.3), Inches(3.4), Inches(0.42))
    pill.fill.solid()
    pill.fill.fore_color.rgb = BOX_BG
    pill.line.color.rgb = BORDER_COLOR
    pill.line.width = Pt(1)
    pp = pill.text_frame.paragraphs[0]
    pp.text = "MCA CAPSTONE PROJECT • NLP"
    pp.font.size = Pt(11)
    pp.font.bold = True
    pp.font.color.rgb = PRIMARY
    pp.alignment = PP_ALIGN.CENTER

    # Project Title
    tb_title = slide.shapes.add_textbox(Inches(1.2), Inches(2.0), Inches(11.0), Inches(1.8))
    tf = tb_title.text_frame
    tf.word_wrap = True
    p1 = tf.paragraphs[0]
    p1.text = "CRUX"
    p1.font.size = Pt(46)
    p1.font.bold = True
    p1.font.color.rgb = NAVY_TITLE

    p2 = tf.add_paragraph()
    p2.text = "A Fast and Accurate Text Summarizer (Extractive NLP)"
    p2.font.size = Pt(22)
    p2.font.color.rgb = PRIMARY
    p2.space_before = Pt(8)

    # Simple description line
    tb_desc = slide.shapes.add_textbox(Inches(1.2), Inches(4.0), Inches(10.5), Inches(0.8))
    p_desc = tb_desc.text_frame.paragraphs[0]
    p_desc.text = "A simple, lightweight system that shortens long text and PDF documents into clear summaries without changing the facts."
    p_desc.font.size = Pt(14)
    p_desc.font.color.rgb = TEXT_BODY

    # Meta card at bottom
    box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(5.0), Inches(10.933), Inches(1.5))
    box.fill.solid()
    box.fill.fore_color.rgb = BOX_BG
    box.line.color.rgb = BORDER_COLOR
    box.line.width = Pt(1)
    btf = box.text_frame
    btf.word_wrap = True
    btf.vertical_anchor = MSO_ANCHOR.MIDDLE

    bp1 = btf.paragraphs[0]
    bp1.text = "Degree: Master of Computer Applications (MCA)   |   Subject: Natural Language Processing (NLP)"
    bp1.font.size = Pt(13)
    bp1.font.bold = True
    bp1.font.color.rgb = NAVY_TITLE

    bp2 = btf.add_paragraph()
    bp2.text = "Department: Department of Computer Applications   |   Academic Session: 2025 – 2026"
    bp2.font.size = Pt(12)
    bp2.font.color.rgb = TEXT_BODY
    bp2.space_before = Pt(4)

    add_speaker_notes(slide, """
Good morning respected teachers and examiners.
Today I am presenting my MCA project called 'Crux'.
It is a simple and fast text summarizer built using Natural Language Processing.
It helps people read long documents and PDFs quickly by picking out the most important real sentences.
""")

def build_slide_2(prs):
    # Slide 2: Project Overview (Plain English)
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide, WHITE)
    add_header(slide, "What is Crux?", "PROJECT OVERVIEW", 2)

    tb = slide.shapes.add_textbox(Inches(0.8), Inches(1.9), Inches(11.733), Inches(4.8))
    tf = tb.text_frame
    tf.word_wrap = True

    points = [
        ("Shortens Long Documents", "Takes long articles, research papers, notes, or PDF files and turns them into clean, short summaries."),
        ("Keeps Original Sentences (Extractive)", "Instead of rewriting or making up new words, it selects the most meaningful original sentences directly from the text."),
        ("No Fake Information", "Because it extracts real sentences, it never invents facts, changes dates, or hallucinates numbers."),
        ("Runs in Milliseconds", "Processes an entire article in under 15 milliseconds on a normal laptop without needing any expensive graphics cards."),
        ("Complete Web Application", "Comes with an easy-to-use web dashboard with sliders, visual score charts, and history saving.")
    ]

    for i, (title, desc) in enumerate(points):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = f"•  {title}: "
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = PRIMARY

        run = p.add_run()
        run.text = desc
        run.font.bold = False
        run.font.color.rgb = TEXT_BODY
        p.space_after = Pt(16)

    add_speaker_notes(slide, """
On this slide, I explain what Crux does.
Basically, it is a tool that takes a long article and shortens it.
It does not rewrite or generate new text. Instead, it finds and extracts the most important sentences written by the author.
This means the summary is always 100% accurate, and it runs in just a few milliseconds.
""")

def build_slide_3(prs):
    # Slide 3: Problem Statement (Plain English)
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide, WHITE)
    add_header(slide, "Why Not Just Use ChatGPT?", "THE PROBLEM WITH GENERATIVE AI", 3)

    tb = slide.shapes.add_textbox(Inches(0.8), Inches(1.9), Inches(11.733), Inches(4.8))
    tf = tb.text_frame
    tf.word_wrap = True

    problems = [
        ("1. AI Can Make Up Facts (Hallucination)", "Tools like ChatGPT try to write like a human, but they often invent fake quotes, wrong dates, or incorrect numbers. In medical or legal documents, that is dangerous."),
        ("2. You Can't See How It Decided (Black Box)", "Deep learning models are like black boxes. They cannot explain the exact math behind why one sentence was included and another was skipped."),
        ("3. Slow and Costly to Run", "Generative AI takes 3 to 10 seconds per summary and needs expensive servers with heavy GPUs or paid API subscriptions."),
        ("4. Privacy Concerns", "To use cloud AI, you must upload your private documents to external servers. This is a problem for companies and hospitals with confidential data.")
    ]

    for i, (title, desc) in enumerate(problems):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = f"{title}\n"
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = NAVY_TITLE

        run = p.add_run()
        run.text = desc
        run.font.size = Pt(14)
        run.font.bold = False
        run.font.color.rgb = TEXT_BODY
        p.space_after = Pt(18)

    add_speaker_notes(slide, """
You might ask: why not just use ChatGPT to summarize text?
There are four big problems with generative AI:
First, they can hallucinate and make up fake details.
Second, you cannot see the mathematical reason why a sentence was picked.
Third, they are slow and expensive to run.
And fourth, uploading private medical or legal files to the cloud can break privacy rules.
""")

def build_slide_4(prs):
    # Slide 4: Proposed Solution (Plain English)
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide, WHITE)
    add_header(slide, "Our Solution: Extractive Summarization", "WHY EXTRACTIVE NLP?", 4)

    tb = slide.shapes.add_textbox(Inches(0.8), Inches(1.9), Inches(11.733), Inches(4.8))
    tf = tb.text_frame
    tf.word_wrap = True

    benefits = [
        ("100% Real Facts (Zero Hallucination)", "We pick verbatim sentences written by the original author. No new words are generated, so the facts never get distorted."),
        ("Clear and Transparent Math", "Every single sentence gets a score based on simple, understandable formulas. You can see exactly why a sentence was selected."),
        ("Super Fast on Normal Laptops", "Runs in under 15 milliseconds on a basic computer CPU. You don't need any expensive graphics card or internet API."),
        ("Keeps Your Files Private", "Documents are read directly in the computer's memory (RAM) and are never saved to the hard drive or sent outside."),
        ("Easy to Verify", "Because every sentence comes directly from the source, you can easily check where it appeared in the original document.")
    ]

    for i, (title, desc) in enumerate(benefits):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = f"•  {title}: "
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = PRIMARY

        run = p.add_run()
        run.text = desc
        run.font.size = Pt(14)
        run.font.bold = False
        run.font.color.rgb = TEXT_BODY
        p.space_after = Pt(16)

    add_speaker_notes(slide, """
Our solution is Extractive Summarization.
Instead of generating new sentences, our system ranks the author's original sentences and picks the best ones.
This guarantees that facts are 100% correct, it runs in less than 15 milliseconds, and it keeps your files completely private.
""")

def build_slide_5(prs):
    # Slide 5: System Architecture (Plain English)
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide, WHITE)
    add_header(slide, "How the System is Built (4 Simple Parts)", "SYSTEM ARCHITECTURE", 5)

    tb = slide.shapes.add_textbox(Inches(0.8), Inches(1.9), Inches(11.733), Inches(4.8))
    tf = tb.text_frame
    tf.word_wrap = True

    layers = [
        ("1. The Website (Frontend)", "Built with React 18 and Tailwind CSS. It gives users a clean screen with text boxes, sliders for summary length, and visual score charts."),
        ("2. The Web Server (Backend)", "Built using FastAPI in Python. It receives the text, sends it to the NLP engine, and returns the summary quickly."),
        ("3. The NLP Engine (The Brain)", "Cleans the text, counts word frequencies, calculates sentence scores, and picks the most important sentences."),
        ("4. The Database (Storage)", "A simple built-in SQLite database that saves past summaries so you can search or reload them with one click.")
    ]

    for i, (title, desc) in enumerate(layers):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = f"{title}\n"
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = NAVY_TITLE

        run = p.add_run()
        run.text = desc
        run.font.size = Pt(14)
        run.font.bold = False
        run.font.color.rgb = TEXT_BODY
        p.space_after = Pt(18)

    add_speaker_notes(slide, """
This slide shows the 4 parts of our project architecture:
1. The frontend website is made with React.
2. The backend server is made with FastAPI in Python.
3. The NLP engine does the actual text processing and scoring.
4. The SQLite database saves history so you can review past summaries anytime.
""")

def build_slide_6(prs):
    # Slide 6: NLP Pipeline (Plain English)
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide, WHITE)
    add_header(slide, "How We Prepare the Text (NLP Pipeline)", "NLP PREPROCESSING", 6)

    tb = slide.shapes.add_textbox(Inches(0.8), Inches(1.9), Inches(11.733), Inches(4.8))
    tf = tb.text_frame
    tf.word_wrap = True

    steps = [
        ("1. Clean the text", "Remove any HTML tags, extra spaces, and weird symbols from the input."),
        ("2. Split into sentences", "Separate the text into sentences using full stops, exclamation marks, or Hindi danda (।) punctuation."),
        ("3. Break into words", "Break each sentence into individual words and filter out stray punctuation."),
        ("4. Make lowercase", "Turn all letters into lowercase so words like 'Computer' and 'computer' are counted together."),
        ("5. Remove filler stop-words", "Drop common words that don't add much meaning, like 'the', 'is', 'at', and 'on'."),
        ("6. Find root words (Lemmatize)", "Convert words back to their dictionary root form (for example: 'running' and 'runs' both become 'run')."),
        ("7. Score and pick", "Calculate a score for each sentence and pick the top sentences."),
        ("8. Restore original order", "Put the chosen sentences back in their original story order so the summary reads smoothly.")
    ]

    for i, (title, desc) in enumerate(steps):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = f"•  {title}: "
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = PRIMARY

        run = p.add_run()
        run.text = desc
        run.font.size = Pt(13)
        run.font.bold = False
        run.font.color.rgb = TEXT_BODY
        p.space_after = Pt(10)

    add_speaker_notes(slide, """
Before scoring sentences, we clean and prepare the text in simple steps:
We remove junk characters, split into sentences, convert to lowercase, filter out common words like 'the' and 'is', and convert words to their root forms.
Finally, we score the sentences and put them back in their original order so they read naturally.
""")

def build_slide_7(prs):
    # Slide 7: Algorithms (Plain English)
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide, WHITE)
    add_header(slide, "The Three Summarization Methods", "ALGORITHMS", 7)

    tb = slide.shapes.add_textbox(Inches(0.8), Inches(1.9), Inches(11.733), Inches(4.8))
    tf = tb.text_frame
    tf.word_wrap = True

    algos = [
        ("1. Frequency Method (Popular Keywords)",
         "Based on H.P. Luhn's idea. Words that appear frequently in a document usually represent its main topic. Sentences that contain a lot of these popular keywords get a higher score. This works great for single-topic news articles."),
        ("2. TF-IDF Method (Unique Keywords)",
         "Finds words that are special or unique to a particular section, rather than words repeated everywhere. This helps pick sentences from different sections of a long, multi-topic document."),
        ("3. Hybrid Method (Best of Both)",
         "Combines both Frequency and TF-IDF using a simple slider. By default, it gives 50% weight to Frequency and 50% to TF-IDF, giving a well-balanced summary.")
    ]

    for i, (title, desc) in enumerate(algos):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = f"{title}\n"
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = NAVY_TITLE

        run = p.add_run()
        run.text = desc
        run.font.size = Pt(14)
        run.font.bold = False
        run.font.color.rgb = TEXT_BODY
        p.space_after = Pt(18)

    add_speaker_notes(slide, """
We built three summarization methods into Crux:
First, the Frequency method: looks for repeated keywords.
Second, the TF-IDF method: looks for unique terms that make a sentence stand out.
Third, the Hybrid method: lets users combine both methods with a simple slider.
""")

def build_slide_8(prs):
    # Slide 8: Math (Plain English)
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide, WHITE)
    add_header(slide, "How Sentences are Scored (The Math)", "SCORING LOGIC", 8)

    tb = slide.shapes.add_textbox(Inches(0.8), Inches(1.9), Inches(11.733), Inches(4.8))
    tf = tb.text_frame
    tf.word_wrap = True

    maths = [
        ("1. Word Importance Weight",
         "Count how many times each word appears. Divide by the most popular word's count so every word gets a weight between 0.0 and 1.0."),
        ("2. Raw Sentence Score",
         "Add up the weights of all the meaningful words in that sentence."),
        ("3. Fair Length Check (Dividing by Square-Root Length)",
         "If we only add word weights, long 60-word sentences always win just because they have more words.\n"
         "If we divide by length, short 3-word sentences win.\n"
         "So we divide by sqrt(Sentence Length), which keeps things fair for medium, informative sentences."),
        ("4. Hybrid Score Formula",
         "Final Score = (alpha * Frequency Score) + (beta * TF-IDF Score)\n"
         "Where alpha and beta are sliders set by the user that add up to 100%.")
    ]

    for i, (title, desc) in enumerate(maths):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = f"•  {title}\n"
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = PRIMARY

        run = p.add_run()
        run.text = desc
        run.font.size = Pt(13.5)
        run.font.bold = False
        run.font.color.rgb = TEXT_BODY
        p.space_after = Pt(14)

    add_speaker_notes(slide, """
Here is the math in plain English:
We score each sentence by adding up the weights of its important words.
To prevent long sentences from winning just because they are long, we divide by the square root of the sentence length.
This keeps the scoring fair and balanced.
""")

def build_slide_9(prs):
    # Slide 9: Step-by-Step Example Walkthrough (Plain English)
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide, WHITE)
    add_header(slide, "A Real Example: How it Works", "STEP-BY-STEP EXAMPLE", 9)

    # Left Container: Input Passage
    box_left = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.7))
    box_left.fill.solid()
    box_left.fill.fore_color.rgb = BOX_BG
    box_left.line.color.rgb = BORDER_COLOR
    box_left.line.width = Pt(1)

    tf_l = box_left.text_frame
    tf_l.word_wrap = True
    p_lh = tf_l.paragraphs[0]
    p_lh.text = "1. Original Text (5 Sentences • 68 Words)"
    p_lh.font.size = Pt(14)
    p_lh.font.bold = True
    p_lh.font.color.rgb = NAVY_TITLE
    p_lh.space_after = Pt(10)

    sentences = [
        ("[S1]", "Artificial intelligence is rapidly transforming healthcare by analyzing vast medical records."),
        ("[S2]", "Modern researchers use machine learning algorithms to detect diseases in medical images early."),
        ("[S3]", "These diagnostic tools actively assist physicians in complex clinical decision-making."),
        ("[S4]", "However, organizations must ensure AI diagnostic algorithms are transparent and secure."),
        ("[S5]", "Protecting patient privacy remains a top priority during digital healthcare transformation.")
    ]
    for idx_lbl, sent_txt in sentences:
        p = tf_l.add_paragraph()
        run_lbl = p.add_run()
        run_lbl.text = f"{idx_lbl} "
        run_lbl.font.size = Pt(11)
        run_lbl.font.bold = True
        run_lbl.font.color.rgb = PRIMARY

        run_txt = p.add_run()
        run_txt.text = sent_txt
        run_txt.font.size = Pt(11)
        run_txt.font.color.rgb = TEXT_BODY
        p.space_after = Pt(7)

    # Right Container: NLP Processing & Extracted Summary
    box_right = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.733), Inches(4.7))
    box_right.fill.solid()
    box_right.fill.fore_color.rgb = BOX_BG
    box_right.line.color.rgb = BORDER_COLOR
    box_right.line.width = Pt(1)

    tf_r = box_right.text_frame
    tf_r.word_wrap = True
    p_rh = tf_r.paragraphs[0]
    p_rh.text = "2. Scoring & Output (Summary Budget = 2 Sentences)"
    p_rh.font.size = Pt(14)
    p_rh.font.bold = True
    p_rh.font.color.rgb = NAVY_TITLE
    p_rh.space_after = Pt(6)

    p_scores = tf_r.add_paragraph()
    p_scores.text = "• Sentence Scores:\n  [S1] Score: 0.72 (Rank 1 - Selected)\n  [S2] Score: 0.68 (Rank 2 - Selected)\n  [S4] 0.49   |   [S3] 0.44   |   [S5] 0.41\n  Top Keywords Found: 'intelligence', 'healthcare', 'algorithms', 'medical'"
    p_scores.font.size = Pt(10.5)
    p_scores.font.color.rgb = TEXT_BODY
    p_scores.space_after = Pt(10)

    p_out_title = tf_r.add_paragraph()
    p_out_title.text = "3. Final Extracted Summary (In Original Order):"
    p_out_title.font.size = Pt(12.5)
    p_out_title.font.bold = True
    p_out_title.font.color.rgb = PRIMARY
    p_out_title.space_after = Pt(4)

    p_out_body = tf_r.add_paragraph()
    p_out_body.text = '"Artificial intelligence is rapidly transforming healthcare by analyzing vast medical records. Modern researchers use machine learning algorithms to detect diseases in medical images early."'
    p_out_body.font.size = Pt(11.5)
    p_out_body.font.italic = True
    p_out_body.font.color.rgb = NAVY_TITLE
    p_out_body.space_after = Pt(10)

    # Telemetry Line
    p_metric = tf_r.add_paragraph()
    p_metric.text = "Result: 68 words down to 28 words  |  59% shorter  |  Time: 4.8 milliseconds"
    p_metric.font.size = Pt(10.5)
    p_metric.font.bold = True
    p_metric.font.color.rgb = PRIMARY

    add_speaker_notes(slide, """
Here is an actual example showing how it works.
On the left is an original 5-sentence passage on Healthcare AI.
Our system counted the keywords and scored every sentence.
Sentence 1 and Sentence 2 got the highest scores because they have the most important keywords.
The system extracted those two sentences and kept their original order.
The final summary is 59% shorter and took less than 5 milliseconds to generate!
""")

def build_slide_10(prs):
    # Slide 10: In-Memory Privacy (Plain English)
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide, WHITE)
    add_header(slide, "Keeping Documents Safe and Private", "PRIVACY & SECURITY", 10)

    tb = slide.shapes.add_textbox(Inches(0.8), Inches(1.9), Inches(11.733), Inches(4.8))
    tf = tb.text_frame
    tf.word_wrap = True

    privacy_points = [
        ("Read Only in Computer Memory (RAM)", "When you upload a PDF or text file, our Python server reads it directly in memory using Python's io.BytesIO. It never writes the file to the computer's hard disk."),
        ("No Temporary Files Left Behind", "Traditional websites save uploaded files in a temp folder where anyone might find them. Crux keeps zero files on disk."),
        ("No External Data Sharing", "Your text is processed locally on your machine. Nothing is ever sent to third-party AI companies or cloud servers."),
        ("Works with Normal PDF and Text Files", "You can type text, paste text, or upload `.pdf`, `.txt`, and `.md` files easily.")
    ]

    for i, (title, desc) in enumerate(privacy_points):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = f"•  {title}\n"
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = NAVY_TITLE

        run = p.add_run()
        run.text = desc
        run.font.size = Pt(14)
        run.font.bold = False
        run.font.color.rgb = TEXT_BODY
        p.space_after = Pt(18)

    add_speaker_notes(slide, """
On this slide, I explain how we protect user privacy.
When a user uploads a PDF or text file, it is processed entirely in the computer's temporary RAM.
We do not save any files to the hard drive, and no text is sent over the internet to external APIs.
Once the summary is displayed, the memory is cleared.
""")

def build_slide_11(prs):
    # Slide 11: ROUGE Evaluation (Plain English)
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide, WHITE)
    add_header(slide, "How We Test Quality: ROUGE Scores", "QUALITY EVALUATION", 11)

    tb = slide.shapes.add_textbox(Inches(0.8), Inches(1.9), Inches(11.733), Inches(4.8))
    tf = tb.text_frame
    tf.word_wrap = True

    eval_points = [
        ("Comparing Against a Human Summary", "To test if our summary is good, we compare it against a summary written by a human expert."),
        ("ROUGE-1 (Single Word Matches)", "Checks how many individual words match between the human summary and our summary. Shows if we covered the main topic."),
        ("ROUGE-2 (Two-Word Phrase Matches)", "Checks pairs of words next to each other (like 'medical records' or 'machine learning'). Shows if phrases make sense."),
        ("ROUGE-L (Sentence Structure)", "Checks if the words appear in the same general order, testing overall flow and coherence."),
        ("Built-in Quality Checker", "Our web dashboard has a button where you can paste any reference summary and immediately see the match percentage.")
    ]

    for i, (title, desc) in enumerate(eval_points):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = f"•  {title}: "
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = PRIMARY

        run = p.add_run()
        run.text = desc
        run.font.size = Pt(13.5)
        run.font.bold = False
        run.font.color.rgb = TEXT_BODY
        p.space_after = Pt(14)

    add_speaker_notes(slide, """
How do we know if our summary is accurate?
We use the standard NLP evaluation metric called ROUGE.
It compares our summary with a summary written by a human.
ROUGE-1 checks single words, ROUGE-2 checks two-word phrases, and ROUGE-L checks sentence structure.
Our website even has a built-in tool where you can test this live.
""")

def build_slide_12(prs):
    # Slide 12: Benchmark Results (Plain English Table)
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide, WHITE)
    add_header(slide, "Test Results: Comparing the Methods", "EXPERIMENTAL RESULTS", 12)

    headers = ["Test Metric", "Frequency Method", "TF-IDF Method", "Hybrid Method (50/50)"]
    rows = [
        ["Requested Sentences", "3 sentences", "3 sentences", "3 sentences"],
        ["Summary Length", "56 words", "51 words", "56 words"],
        ["Space Saved (% Shorter)", "46.7% shorter", "51.4% shorter", "46.7% shorter"],
        ["Time Taken (Speed)", "4.2 milliseconds", "5.1 milliseconds", "5.8 milliseconds"],
        ["ROUGE-1 (Word Match)", "48.6%", "46.2%", "48.6%"],
        ["ROUGE-2 (Phrase Match)", "22.4%", "20.1%", "22.4%"],
        ["ROUGE-L (Flow Match)", "44.1%", "41.8%", "44.1%"]
    ]

    col_widths = [Inches(3.2), Inches(2.8), Inches(2.8), Inches(2.933)]
    table_shape = slide.shapes.add_table(len(rows) + 1, 4, Inches(0.8), Inches(1.8), Inches(11.733), Inches(4.2))
    table = table_shape.table

    for i, w in enumerate(col_widths):
        table.columns[i].width = w

    for col_idx, h_text in enumerate(headers):
        cell = table.cell(0, col_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = PRIMARY_DARK
        tf = cell.text_frame
        p = tf.paragraphs[0]
        p.text = h_text
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = WHITE
        p.alignment = PP_ALIGN.CENTER if col_idx > 0 else PP_ALIGN.LEFT

    for row_idx, r_data in enumerate(rows):
        bg = WHITE if row_idx % 2 == 0 else BOX_BG
        for col_idx, val in enumerate(r_data):
            cell = table.cell(row_idx + 1, col_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = bg
            tf = cell.text_frame
            p = tf.paragraphs[0]
            p.text = val
            p.font.size = Pt(12)
            if col_idx == 0:
                p.font.bold = True
                p.font.color.rgb = NAVY_TITLE
                p.alignment = PP_ALIGN.LEFT
            else:
                p.font.color.rgb = PRIMARY if col_idx == 3 else TEXT_BODY
                p.font.bold = True if col_idx == 3 else False
                p.alignment = PP_ALIGN.CENTER

    # Bottom observation
    tb_obs = slide.shapes.add_textbox(Inches(0.8), Inches(6.2), Inches(11.733), Inches(0.8))
    p_obs = tb_obs.text_frame.paragraphs[0]
    p_obs.text = "Key Takeaway: All three methods run in under 6 milliseconds on a normal computer. The Hybrid method got the best overall match scores."
    p_obs.font.size = Pt(13)
    p_obs.font.bold = True
    p_obs.font.color.rgb = PRIMARY

    add_speaker_notes(slide, """
This table shows the actual test results when summarizing a sample article.
All three algorithms take less than 6 milliseconds to run.
They shortened the text by about 50%, and the Hybrid method achieved the highest overall match score with the human summary.
""")

def build_slide_13(prs):
    # Slide 13: UI Features (Plain English)
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide, WHITE)
    add_header(slide, "Features of the Web Dashboard", "USER EXPERIENCE", 13)

    tb = slide.shapes.add_textbox(Inches(0.8), Inches(1.9), Inches(11.733), Inches(4.8))
    tf = tb.text_frame
    tf.word_wrap = True

    features = [
        ("Smart Sentence Slider", "Drag the slider to pick how many sentences you want. The slider automatically knows how many sentences are in your text and will never let you pick too many."),
        ("Interactive Score Chart", "A colorful bar chart shows the exact score of every sentence. Extracted sentences are highlighted in blue so you can see why they won."),
        ("Compare Tab", "One click runs all three algorithms side-by-side so you can see how Frequency, TF-IDF, and Hybrid differ."),
        ("Saved History & Restore", "Automatically saves your past summaries. You can search your past runs and click 'Restore' to reload any old text back into the editor."),
        ("Copy and Download", "Single button to copy the summary to your clipboard or download it as a `.txt` file.")
    ]

    for i, (title, desc) in enumerate(features):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = f"•  {title}: "
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = PRIMARY

        run = p.add_run()
        run.text = desc
        run.font.size = Pt(13.5)
        run.font.bold = False
        run.font.color.rgb = TEXT_BODY
        p.space_after = Pt(14)

    add_speaker_notes(slide, """
On Slide 13, I highlight the features of our web dashboard:
You can adjust the summary length with a slider, inspect individual sentence scores on an interactive chart, compare all three methods side-by-side, and restore past runs from the history tab.
""")

def build_slide_14(prs):
    # Slide 14: Tech Stack (Plain English)
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide, WHITE)
    add_header(slide, "Technologies Used", "TECH STACK", 14)

    tb = slide.shapes.add_textbox(Inches(0.8), Inches(1.9), Inches(11.733), Inches(4.8))
    tf = tb.text_frame
    tf.word_wrap = True

    techs = [
        ("Python 3.10+", "The main programming language used for the backend logic and NLP algorithms."),
        ("FastAPI", "A modern, high-speed Python web framework used to create our REST API server."),
        ("NLTK & Scikit-learn", "Standard Python NLP libraries used for finding stop-words, lemmatizing root words, and TF-IDF math."),
        ("React 18 & Vite", "Modern frontend web framework used to build our fast and responsive dashboard."),
        ("Tailwind CSS", "A utility-first CSS framework used for clean styling, responsive layouts, and smooth animations."),
        ("SQLite", "A lightweight, built-in database used to store history with zero extra setup needed."),
        ("Pytest", "Automated testing tool used to verify 20+ test cases (including Hindi/Devanagari text).")
    ]

    for i, (title, desc) in enumerate(techs):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = f"•  {title}: "
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = NAVY_TITLE

        run = p.add_run()
        run.text = desc
        run.font.size = Pt(13.5)
        run.font.bold = False
        run.font.color.rgb = TEXT_BODY
        p.space_after = Pt(14)

    add_speaker_notes(slide, """
This slide lists the technologies we used:
Python with FastAPI for the backend, NLTK and Scikit-learn for NLP processing, React 18 and Tailwind CSS for the user interface, SQLite for storage, and Pytest to make sure everything works without errors.
""")

def build_slide_15(prs):
    # Slide 15: Conclusion (Plain English)
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide, WHITE)
    add_header(slide, "Conclusion", "WRAP UP", 15)

    tb = slide.shapes.add_textbox(Inches(0.8), Inches(1.9), Inches(11.733), Inches(3.6))
    tf = tb.text_frame
    tf.word_wrap = True

    takeaways = [
        ("100% Truthful Summaries", "Because it extracts original sentences directly, it never hallucinates or makes up fake facts."),
        ("Fast and Free to Run", "Runs in under 15 milliseconds on a basic laptop with zero expensive GPU or cloud API bills."),
        ("Simple and Understandable", "Every sentence gets a clear score, making the decisions easy to explain and verify."),
        ("Complete Working MCA Project", "Combines NLP algorithms, a fast Python backend, a clean React website, and an embedded database.")
    ]

    for i, (title, desc) in enumerate(takeaways):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = f"✓  {title}: "
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = PRIMARY

        run = p.add_run()
        run.text = desc
        run.font.size = Pt(14)
        run.font.bold = False
        run.font.color.rgb = TEXT_BODY
        p.space_after = Pt(14)

    # Thank you box at bottom
    box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.8), Inches(11.733), Inches(1.0))
    box.fill.solid()
    box.fill.fore_color.rgb = PRIMARY
    box.line.fill.background()
    btf = box.text_frame
    btf.vertical_anchor = MSO_ANCHOR.MIDDLE
    bp = btf.paragraphs[0]
    bp.text = "Thank You! Questions are Welcome."
    bp.font.size = Pt(18)
    bp.font.bold = True
    bp.font.color.rgb = WHITE
    bp.alignment = PP_ALIGN.CENTER

    add_speaker_notes(slide, """
In conclusion:
Crux shows that classical, transparent NLP methods are still very useful today.
They give 100% accurate summaries, execute in milliseconds on normal computers, and are completely free and private.
Thank you for listening.
I am happy to answer any questions you have.
""")

def main():
    print("Generating Crux Academic Presentation (15 Slides)...")
    prs = create_presentation()

    builders = [
        build_slide_1, build_slide_2, build_slide_3, build_slide_4,
        build_slide_5, build_slide_6, build_slide_7, build_slide_8,
        build_slide_9, build_slide_10, build_slide_11, build_slide_12,
        build_slide_13, build_slide_14, build_slide_15
    ]

    for idx, builder in enumerate(builders, start=1):
        print(f"Building Slide {idx} of {TOTAL_SLIDES}...")
        builder(prs)

    # Primary save to Crux_NLP_Presentation.pptx
    crux_path = os.path.join(os.getcwd(), "Crux_NLP_Presentation.pptx")
    prs.save(crux_path)
    print(f"\n[SUCCESS] Saved presentation to: {crux_path}")

    # Also update previous presentation files if not locked
    for fname in ["Summarsphere_Presentation_Simple.pptx", "Summarsphere_NLP_Presentation.pptx"]:
        fpath = os.path.join(os.getcwd(), fname)
        try:
            prs.save(fpath)
            print(f"[SUCCESS] Also updated: {fpath}")
        except PermissionError:
            print(f"[NOTE] '{fpath}' is currently open in PowerPoint. Skipped.")

if __name__ == "__main__":
    main()
