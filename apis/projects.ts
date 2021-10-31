const base = 'http://localhost:5003';

async function CreateProject() {
    const f = await fetch(`${base}/projects`, {
        method: 'POST',
        headers: { authorization: 'Bearer hi' },
    });
    return f.json();
}

async function GetProjects() {
    const f = await fetch(`${base}/projects`, {
        method: 'GET',
        headers: { authorization: 'Bearer hi' },
    });
    return f.json();
}

async function SetLikeProject(projectId: number, userId: number, like: boolean) {
    const f = await fetch(`${base}/projects/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            projectId,
            userId,
            like,
        }),
    });
    return f.json();
}

export {
    CreateProject,
    GetProjects,
    SetLikeProject,
};
