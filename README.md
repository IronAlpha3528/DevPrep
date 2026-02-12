# DevPrep – AI-Powered Interview Preparation Platform  
### Project for Thinking Machine, IIIT Pune

---

## Project Preview

![DevPrep Banner](https://github.com/user-attachments/assets/d4cf30d0-2ba9-4a8b-853d-9e8672b6078f)  
<!-- Replace with your actual image link -->

---

## About the Project

DevPrep is an AI-powered interview preparation and readiness platform designed to help students and early-career professionals prepare for real-world technical and HR interviews.

The platform simulates realistic interview scenarios, evaluates both technical and soft skills, and provides personalized feedback to bridge the gap between academic learning and industry expectations.

---

## Problem Statement

Despite having strong academic knowledge, many students struggle in real interviews due to:

- Lack of real interview exposure  
- No resume-based personalized practice  
- High anxiety and low confidence  
- Limited feedback on communication and soft skills  
- Existing tools being mostly static (videos, blogs, MCQs)

### Core Problem

Students are academically prepared but not interview-ready.

---

## Proposed Solution

DevPrep addresses this gap by offering a realistic, interactive, and AI-driven interview experience.

The platform:

- Conducts resume-aware mock interviews  
- Simulates real interview pressure  
- Evaluates technical and soft skills  
- Provides actionable feedback  
- Enables guided, repeated practice  

---

## Key Features

### Resume-Aware Analysis
- Parses resumes to extract skills and projects  
- Generates personalized interview questions  
- Detects vague or inconsistent claims  

### Dual Interview Modes
- Virtual Interview (Voice / Video)  
- Text-Based Interview  

### Adaptive AI Interviewer
- Adjusts question difficulty dynamically  
- Generates intelligent follow-ups  
- Simulates human-like interview flow  

### Intelligent Evaluation
Evaluates:

- Technical accuracy  
- Problem-solving approach  
- Communication clarity  
- Confidence and soft skills  

Produces explainable multi-dimensional scores.

### Real-Time Monitoring
- Facial engagement tracking  
- Body language analysis  
- On-screen behavior monitoring  

### Personalized Feedback
- Skill-wise reports  
- Strength and weakness analysis  
- Improvement roadmap  
- Learning recommendations  

---

## System Workflow

1. Student logs in and uploads resume  
2. Resume is parsed into a structured profile  
3. Student selects interview mode  
4. AI conducts resume-based interview  
5. System monitors engagement  
6. AI evaluates performance  
7. Readiness report is generated  

---

## Technology Stack

### Frontend
- React.js  
- Tailwind CSS  
- WebRTC (Video/Audio Interviews)  
- Monaco Editor (Coding Interface)

### Backend
- FastAPI  
- JWT Authentication  
- Redis (Caching & Session Management)

### Resume Processing & AI
- LLaMA (Large Language Model)  
- NetworkX (Knowledge Graph Processing)

### Coding Environment
- Docker (Isolated Execution)  
- Celery (Asynchronous Task Queue)

### Database & Storage
- PostgreSQL (Primary Database)  
- Cloud Storage (Resume & Media Files)

---

## Architecture Overview

- Microservice-based backend using FastAPI  
- AI services integrated via APIs  
- Asynchronous processing using Celery  
- Containerized execution using Docker  
- Secure authentication using JWT  
- Real-time communication using WebRTC  

---
