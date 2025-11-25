from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, constr


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: int
    role: str


class UserCreate(BaseModel):
    email: constr(strip_whitespace=True, to_lower=True)
    password: constr(min_length=6)
    role: str = Field(default="teacher", pattern="^(teacher|student)$")


class UserRead(BaseModel):
    id: int
    email: str
    role: str
    created_at: datetime

    class Config:
        orm_mode = True


class LoginRequest(BaseModel):
    email: str
    password: str


class TestCreate(BaseModel):
    name: str
    description: Optional[str] = None


class TestRead(BaseModel):
    id: int
    name: str
    description: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True


class QuestionCreate(BaseModel):
    prompt: str
    model_answer_text: Optional[str] = None


class QuestionRead(BaseModel):
    id: int
    prompt: str
    model_answer_text: str
    created_at: datetime

    class Config:
        orm_mode = True


class SubmissionCreate(BaseModel):
    student_name: str
    student_answer_text: Optional[str] = None


class SubmissionRead(BaseModel):
    id: int
    student_name: str
    student_answer_text: str
    similarity_score: float
    created_at: datetime

    class Config:
        orm_mode = True


class ScoreResponse(BaseModel):
    similarity_score: float
    normalized_score: float
    model_answer: str
    student_answer: str


