// src/components/MemberList.jsx

function MemberList({ members }) {
    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <h4 className="card-title mb-4">Members 🧑‍🤝‍🧑</h4>
                <ul className="list-group list-group-flush">
                    {members.map(member => (
                        <li key={member.id} className="list-group-item">{member.username}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default MemberList;