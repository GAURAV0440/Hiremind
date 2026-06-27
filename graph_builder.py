from langgraph.graph import StateGraph, END

from state.interview_state import InterviewState

from agents.resume_agent import resume_agent
from agents.jd_agent import jd_agent
from agents.match_agent import match_agent
from agents.level_agent import level_agent
from agents.interview_planner import interview_planner
from agents.question_agent import question_agent
from agents.evaluation_agent import evaluation_agent
from agents.strategy_agent import strategy_agent
from agents.report_agent import report_agent


def route_after_strategy(state: InterviewState):
    """
    Decide the next node after strategy.
    """

    if state["next_action"] == "ask_followup":
        return "question"

    if state["next_action"] == "next_question":
        return "question"

    return "report"


builder = StateGraph(InterviewState)

# =====================================================
# Nodes
# =====================================================

builder.add_node("resume", resume_agent)

builder.add_node("jd", jd_agent)

builder.add_node("match", match_agent)

builder.add_node("level", level_agent)

builder.add_node("planner", interview_planner)

builder.add_node("question", question_agent)

builder.add_node("evaluation", evaluation_agent)

builder.add_node("strategy", strategy_agent)

builder.add_node("report", report_agent)

# =====================================================
# Entry
# =====================================================

builder.set_entry_point("resume")

# =====================================================
# Initial Pipeline
# =====================================================

builder.add_edge(
    "resume",
    "jd"
)

builder.add_edge(
    "jd",
    "match"
)

builder.add_edge(
    "match",
    "level"
)

builder.add_edge(
    "level",
    "planner"
)

builder.add_edge(
    "planner",
    "question"
)

# =====================================================
# Interview Loop
# =====================================================

builder.add_edge(
    "evaluation",
    "strategy"
)

builder.add_conditional_edges(
    "strategy",
    route_after_strategy,
    {
        "question": "question",
        "report": "report"
    }
)

# =====================================================
# End
# =====================================================

builder.add_edge(
    "report",
    END
)

graph = builder.compile()