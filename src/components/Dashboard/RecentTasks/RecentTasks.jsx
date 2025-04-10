import React from 'react';
import './RecentTasks.css';

const RecentTasks = () => {
    return (
        <div className="recent-tasks">
            <h2 className="recent-tasks-title">Последние задачи</h2>
            <div className="table-container">
                <table className="tasks-table">
                    <thead>
                        <tr>
                            <th>Название</th>
                            <th>Объект</th>
                            <th>Статус</th>
                            <th>Дедлайн</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Здесь будут отображаться задачи */}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentTasks;
