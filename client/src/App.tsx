import React, { useEffect, useRef, useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { initSocket, getSocket } from './socket';
import { fetchNotifications, markNotificationsAsRead, NotificationRecord } from './api';

const USER_ID = 'alice';

function App() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);

  // Use a ref to store the socket instance
  const socketRef = useRef(getSocket());

  useEffect(() => {
    // Initialize the socket if not already initialized.
    if (!socketRef.current) {
      initSocket(USER_ID);
      socketRef.current = getSocket();
    }

    // Fetch notifications on mount.
    fetchNotifications(USER_ID, true).then((data) => {
      setNotifications(data);
    });

    // Attach the real-time event listener.
    const socket = socketRef.current;
    if (socket) {
      const handler = (newNotification: NotificationRecord) => {
        // Only update if notification is for this user.
        if (newNotification.user_id === USER_ID) {
          setNotifications((prev) => [newNotification, ...prev]);
        }
      };

      socket.on('notification', handler);

      // Cleanup listener on unmount.
      return () => {
        socket.off('notification', handler);
      };
    }
  }, []); // Runs only once

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkRead = async (notification: NotificationRecord) => {
    try {
      await markNotificationsAsRead(USER_ID, [notification.id]);
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    } catch (error) {
      console.error('Error marking notification as read', error);
    }
  };

  const unreadCount = notifications.length;

  return (
      <>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Jira-like Notifications
            </Typography>
            <IconButton color="inherit" onClick={handleOpen}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Notification Menu */}
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{ style: { maxHeight: 300, width: 360 } }}
        >
          {notifications.length === 0 ? (
              <MenuItem onClick={handleClose}>
                <Typography>No Unread Notifications</Typography>
              </MenuItem>
          ) : (
              <List>
                {notifications.map((notif) => {
                  const { issueKey, oldStatus, newStatus, message } = notif.details || {};

                  return (
                      // @ts-ignore
                      <ListItem
                          key={notif.id}
                          button
                          onClick={() => {
                            handleMarkRead(notif);
                            handleClose();
                          }}
                          alignItems="flex-start"
                      >
                        <ListItemText
                            primary={`${notif.type}`}
                            secondary={
                              <>
                                {issueKey && (
                                    <Typography component="span" variant="body2" color="text.primary">
                                      Issue Key: {issueKey}
                                    </Typography>
                                )}
                                {oldStatus && newStatus && (
                                    <Typography component="span" variant="body2" color="text.secondary">
                                      &nbsp;Status: {oldStatus} → {newStatus}
                                    </Typography>
                                )}
                                {message && (
                                    <Typography component="span" variant="body2" color="text.secondary">
                                      &nbsp;Message: {message}
                                    </Typography>
                                )}
                                <Typography component="span" variant="caption" color="text.disabled">
                                  &nbsp;{new Date(notif.created_at).toLocaleString()}
                                </Typography>
                              </>
                            }
                        />
                      </ListItem>
                  );
                })}
              </List>
          )}
        </Menu>

        <Box sx={{ p: 2 }}>
          <Typography>
            This is a simple React app that shows real-time Jira-like notifications for user <strong>{USER_ID}</strong>.
          </Typography>
        </Box>
      </>
  );
}

export default App;