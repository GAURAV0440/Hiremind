from state.interview_state import InterviewState


GENERAL_TOPICS = [
    "Problem Solving",
    "System Design",
    "Behavioral"
]


def split_topics(items: list) -> list[str]:
    """
    Split comma-separated skills/topics into individual topics.
    """

    topics = []

    for item in items:

        if isinstance(item, dict):

            for value in item.values():

                if isinstance(value, str):

                    parts = value.split(",")

                    for part in parts:

                        part = part.strip()

                        if part:
                            topics.append(part)

        elif isinstance(item, str):

            parts = item.split(",")

            for part in parts:

                part = part.strip()

                if part:
                    topics.append(part)

    return topics


def interview_planner(state: InterviewState) -> InterviewState:
    """
    Build a ranked interview plan.
    """

    plan = []

    # ==========================================
    # 1. Projects (Highest Priority)
    # ==========================================

    plan.extend(
        split_topics(
            state["candidate_projects"]
        )
    )

    # ==========================================
    # 2. Experience
    # ==========================================

    plan.extend(
        split_topics(
            state["candidate_experience"]
        )
    )

    # ==========================================
    # 3. Resume + JD Matched Skills
    # ==========================================

    plan.extend(
        split_topics(
            state["matched_skills"]
        )
    )

    # ==========================================
    # 4. Missing JD Skills
    # ==========================================

    plan.extend(
        split_topics(
            state["missing_skills"]
        )
    )

    # ==========================================
    # 5. General Topics
    # ==========================================

    plan.extend(GENERAL_TOPICS)

    # ==========================================
    # Remove Duplicates
    # ==========================================

    unique_plan = []

    seen = set()

    for topic in plan:

        topic = topic.strip()

        if not topic:
            continue

        key = topic.lower()

        if key not in seen:

            seen.add(key)

            unique_plan.append(topic)

    # ==========================================
    # Decide interview size
    # ==========================================

    difficulty = state["interview_difficulty"]

    if difficulty == "Basic":

        max_topics = 6

    elif difficulty == "Medium":

        max_topics = 8

    else:

        max_topics = 10

    unique_plan = unique_plan[:max_topics]

    # ==========================================
    # Save
    # ==========================================

    state["interview_plan"] = unique_plan

    state["remaining_topics"] = unique_plan.copy()

    state["covered_topics"] = []

    if unique_plan:

        state["current_topic"] = unique_plan[0]

    else:

        state["current_topic"] = "General"

    return state