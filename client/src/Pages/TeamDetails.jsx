import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Navigation from "../Components/Navigation";
import { useParams, useNavigate } from "react-router-dom";

function TeamDetails() {
    const { group_id } = useParams();
    const navigate = useNavigate();
    const [teamDetails, setTeamDetails] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeamData = async () => {
            try {
                // Fetch team details
                const teamResponse = await fetch(`http://localhost:8080/student_groups/${group_id}`);
                
                if (!teamResponse.ok) {
                    throw new Error("Team not found");
                }
                
                const teamData = await teamResponse.json();
                setTeamDetails(teamData[0]); // Assuming the response is an array
                setLoading(false);
                
                // Fetch members of the team
                const membersResponse = await fetch(`http://localhost:8080/student-members/${group_id}`);
                const membersData = await membersResponse.json();
                setMembers(membersData);
            } catch (error) {
                console.error("Error fetching team data:", error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchTeamData();
    }, [group_id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!teamDetails) {
        return <div>No team details available.</div>;
    }

    return (
            <div>
                <div style={{flex: '1' , overflow: 'auto'}}>
                    <Header />
                    <Navigation />
                    <div style={{ position: 'relative' , height: '650px' }}>
                        <div className="VTContainer">
                            <h1>{teamDetails.team_name}</h1>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">First Name</th>
                                        <th scope="col">Last Name</th>
                                        <th scope="col">Username</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {Array.isArray(members) && members.length > 0 ? (
                                    members.map(member => (
                                            <tr key={member.user_id}>
                                                <td style={{ textAlign: 'center' }}>{member.first_name}</td>
                                                <td style={{ textAlign: 'center' }}>{member.last_name}</td>
                                                <td style={{ textAlign: 'center' }}>{member.username}</td>
                                            </tr>
                                        ))

                                ) : (
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center' }}>No members found for this team.</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>

                            {Array.isArray(members) && members.length > 0 && (
                                <div style={{ textAlign: 'center'}}>
                                    <button className="ViewButton" style={{width: '200px'}}>Peer Review Details</button>
                                </div>
                            )}
                            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                <button className="ViewButton" onClick={() => navigate(-1)}>Back</button>
                            </div>
                        </div>
                    </div>  
                    <Footer />
                </div>
            </div>
    );
}

export default TeamDetails;