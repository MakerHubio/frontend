import Project from '../models/Project';
import getCookie from '../utils/cookie';

//const base = 'http://data.makerhub.io:8080/projects';
const base = 'http://127.0.0.1:5002/projects';

async function CreateProject(project: Project) {
    const f = await fetch(`${base}/`, {
        method: 'POST',
        body: JSON.stringify({
            name: project.name,
            description: project.description,
            price: project.price,
            tags: project.tags,
        }),
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Authorization: getCookie('mh_authorization'),
        },
    });
    return f.json();
}

async function GetProjects() {
    const f = await fetch(`${base}/`, {
        method: 'GET',
        credentials: 'include',
    });
    return f.json();
}

async function GetProject(id: string) {
    const f = await fetch(`${base}/${id}`, {
        method: 'GET',
        credentials: 'include',
    });
    return f.json();
}

async function SetLikeProject(projectId: number, userId: number, like: boolean) {
    const f = await fetch(`${base}/like`, {
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
    GetProject,
};
