import sys
from typing import Literal

from pydantic import BaseModel as PydanticBaseModel
from rope.base.project import Project
from rope.refactor.inline import create_inline


class CursorData(PydanticBaseModel):
    start_offset: int
    end_offset: int
    file_path: str


class Message(PydanticBaseModel):
    command: str
    cursor_data: CursorData


class InitMessage(PydanticBaseModel):
    command: Literal["init"]
    workspace_folder: str


def alert_vscode(message: str, stderr: bool = False) -> None:
    print(message, file=sys.stderr if stderr else sys.stdout, flush=True, end="")


def main():
    init_msg = InitMessage.model_validate_json(sys.stdin.readline().strip())
    project = Project(init_msg.workspace_folder)

    while True:
        message = Message.model_validate_json(sys.stdin.readline().strip())
        match message.command:
            case "create_inline":
                inline_var = create_inline(
                    project,
                    project.get_resource(message.cursor_data.file_path),
                    message.cursor_data.start_offset,
                )
                alert_vscode(f"Running: {message.command}")
                inline_var.get_changes().do()
                alert_vscode(f"Completed: {message.command}")
            case _:
                alert_vscode(f"Unknown command: {message.command}", stderr=True)

if __name__ == "__main__":
    main()
